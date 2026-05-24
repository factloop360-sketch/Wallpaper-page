import { NextResponse } from "next/server";

import {
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { r2 } from "@/lib/r2";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const preview_Url =
      body.preview_Url;

    const vault_Key =
      body.vault_Key;

    if (
      !preview_Url ||
      !vault_Key
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // ------------------------
    // EXTRACT PREVIEW FILE
    // ------------------------

    const previewFileName =
      preview_Url
        .split("/")
        .pop()
        ?.split("?")[0];

    if (!previewFileName) {

      return NextResponse.json(
        {
          error:
            "Invalid preview filename",
        },
        {
          status: 400,
        }
      );
    }

    // ------------------------
    // DELETE PREVIEW
    // ------------------------

    await r2.send(
      new DeleteObjectCommand({
        Bucket:
          process.env
            .R2_BUCKET_NAME!,

        Key:
          previewFileName,
      })
    );

    // ------------------------
    // DELETE ORIGINAL
    // ------------------------

    await r2.send(
      new DeleteObjectCommand({
        Bucket:
          process.env
            .R2_BUCKET_NAME!,

        Key:
          vault_Key,
      })
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "DELETE ERROR:"
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}