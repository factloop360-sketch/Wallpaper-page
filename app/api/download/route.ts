import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
) {

  try {

    const url =
      req.nextUrl.searchParams.get(
        "url"
      );

    const filename =
      req.nextUrl.searchParams.get(
        "filename"
      ) || "download.jpg";

    if (!url) {

      return new Response(
        "Missing file URL",
        { status: 400 }
      );
    }

    // Fetch the remote file
    const fileResponse =
      await fetch(url);

    if (!fileResponse.ok) {

      return new Response(
        "Failed to fetch file",
        { status: 500 }
      );
    }

    const contentType =
      fileResponse.headers.get(
        "content-type"
      ) || "application/octet-stream";

    // Stream file back
    return new Response(
      fileResponse.body,
      {
        headers: {
          "Content-Type":
            contentType,

          "Content-Disposition":
            `attachment; filename="${filename}"`,

          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {

    console.error(
      "Download proxy failed:",
      error
    );

    return new Response(
      "Download failed",
      { status: 500 }
    );
  }
}