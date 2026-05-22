import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vaultKey = searchParams.get("key");

    if (!vaultKey) {
      return NextResponse.json({ error: "Access Denied: Missing Vault Key." }, { status: 400 });
    }

    if (!process.env.R2_BUCKET_NAME) {
      return NextResponse.json({ error: "System Error: Vault disconnected." }, { status: 500 });
    }

    // 1. Prepare the exact file retrieval command
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: vaultKey,
      // 🚨 CRITICAL: This specific line tells the browser to DOWNLOAD the file 
      // instead of just opening the image in a new tab!
      ResponseContentDisposition: `attachment; filename="${vaultKey.replace("vault-", "")}"`,
    });

    // 2. Generate the temporary, cryptographically signed URL
    // It will completely self-destruct and become invalid in 60 seconds
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 });

    // 3. Instantly redirect the user's browser to Cloudflare
    // Vercel handles NO heavy image data, dropping your server bandwidth to absolute ZERO!
    return NextResponse.redirect(signedUrl);

  } catch (error: any) {
    console.error("Secure Download Gateway Exception:", error);
    return NextResponse.json(
      { error: "Vault Extraction Failed." }, 
      { status: 500 }
    );
  }
}