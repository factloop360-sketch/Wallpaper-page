import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file object detected." }, { status: 400 });
    }

    if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
      return NextResponse.json({ success: false, error: `Server Configuration Mismatch.` }, { status: 500 });
    }

    // Convert file to a Node Buffer for Sharp processing and S3 upload
    const arrayBuffer = await file.arrayBuffer();
    const masterBuffer = Buffer.from(arrayBuffer);

    // Sanitize file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    // 🚨 METADATA SEPARATION: Create two distinct keys
    const masterFileName = `vault-${Date.now()}-${sanitizedName}`;
    const previewFileName = `preview-${Date.now()}-${sanitizedName.split('.')[0]}.webp`;

    // 1. Generate a lightweight, highly compressed WebP preview
    const previewBuffer = await sharp(masterBuffer)
      .resize({ width: 600, withoutEnlargement: true }) // Perfect size for grid cards
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Upload the Public Preview (Aggressively Edge Cached)
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: previewFileName,
        Body: previewBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable", // Tells Cloudflare to cache for 1 year!
      })
    );

    // 3. Upload the Secure Master File (Private Vault)
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: masterFileName,
        Body: masterBuffer,
        ContentType: file.type,
        // Private cache control ensures CDNs don't cache secure signed-url requests
        CacheControl: "private, max-age=31536000, immutable", 
      })
    );

    // Only the preview gets a public URL. The master file remains just a key.
    const previewUrl = `${process.env.R2_PUBLIC_URL}/${previewFileName}`;

    return NextResponse.json({
      success: true,
      preview_url: previewUrl,
      file_key: masterFileName, // Hand this back to save as 'vault_key' in Supabase
    });

  } catch (error: any) {
    console.error("CRITICAL API ROUTE EXCEPTION:", error);
    return NextResponse.json(
      { success: false, error: `Server Exception: ${error.message}` },
      { status: 500 }
    );
  }
}