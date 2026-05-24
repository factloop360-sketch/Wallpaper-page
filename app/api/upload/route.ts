import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_SIZE =
  100 * 1024 * 1024; // 100MB

export async function POST(
  req: Request
) {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {

      return NextResponse.json(
        {
          success: false,
          error:
            "No file uploaded",
        },
        { status: 400 }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "File exceeds 100MB limit",
        },
        { status: 413 }
      );
    }

    if (
      !process.env
        .R2_BUCKET_NAME ||
      !process.env
        .R2_PUBLIC_URL
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Missing R2 environment variables",
        },
        { status: 500 }
      );
    }

    // ------------------------
    // CLEAN FILE NAME
    // ------------------------

    const sanitizedName =
      file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

    const timestamp =
      Date.now();

    const masterFileName =
      `vault-${timestamp}-${sanitizedName}`;

    const previewFileName =
      `preview-${timestamp}-${sanitizedName.split(".")[0]}.webp`;

    // ------------------------
    // READ FILE ONCE
    // ------------------------

    const arrayBuffer =
      await file.arrayBuffer();

    const inputBuffer =
      Buffer.from(arrayBuffer);

    // ------------------------
    // UPLOAD ORIGINAL FIRST
    // ------------------------

    await r2.send(
      new PutObjectCommand({
        Bucket:
          process.env
            .R2_BUCKET_NAME,

        Key: masterFileName,

        Body: inputBuffer,

        ContentType:
          file.type,

        CacheControl:
          "no-store",
      })
    );

    // ------------------------
    // GENERATE LIGHTWEIGHT PREVIEW
    // ------------------------

    const previewBuffer =
      await sharp(inputBuffer, {
        failOn: "none",
      })

        .rotate()

        // VERY IMPORTANT
        // Resize immediately
        .resize({
          width: 800,
          withoutEnlargement: true,
          fit: "inside",
        })

        // Lower memory pressure
        .webp({
          quality: 65,
          effort: 2,
        })

        .toBuffer();

    // ------------------------
    // UPLOAD PREVIEW
    // ------------------------

    await r2.send(
      new PutObjectCommand({
        Bucket:
          process.env
            .R2_BUCKET_NAME,

        Key: previewFileName,

        Body: previewBuffer,

        ContentType:
          "image/webp",

        CacheControl:
          "public, max-age=31536000, immutable",
      })
    );

    // ------------------------
    // PREVIEW URL
    // ------------------------

    const preview_Url =
      `${process.env.R2_PUBLIC_URL}/${previewFileName}`;

    // ------------------------
    // CLEAN MEMORY ASAP
    // ------------------------

    // @ts-ignore
    inputBuffer.fill(0);

    // ------------------------
    // SUCCESS
    // ------------------------

    return NextResponse.json({
      success: true,

      preview_Url:
        preview_Url,

      vault_key:
        masterFileName,
    });

  } catch (error: any) {

    console.error(
      "UPLOAD ERROR:"
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          error.message ||
          "Upload failed",
      },
      { status: 500 }
    );
  }
}