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

    const imageUrl =
      body.imageUrl;

    if (!imageUrl) {

      return NextResponse.json(
        {
          error:
            "Missing image URL",
        },
        {
          status: 400,
        }
      );
    }

    // Extract filename from URL
    const fileName =
      imageUrl.split("/").pop();

    if (!fileName) {

      return NextResponse.json(
        {
          error:
            "Invalid file name",
        },
        {
          status: 400,
        }
      );
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket:
          process.env.R2_BUCKET_NAME!,
        Key: fileName,
      })
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

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