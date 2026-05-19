import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import {
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { r2 } from "@/lib/r2";

import {
  createClient,
} from "@supabase/supabase-js";

// ------------------------
// STRIPE
// ------------------------

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion:
      "2026-04-22.dahlia" as any,
  }
);

// ------------------------
// SUPABASE
// ------------------------

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL!,
  process.env
    .SUPABASE_SERVICE_ROLE_KEY!
);

// ------------------------
// PREMIUM DOWNLOAD ROUTE
// ------------------------

export async function POST(
  req: Request
) {

  try {

    const {
      sessionId,
      wallpaperId,
    } = await req.json();

    // ------------------------
    // VALIDATION
    // ------------------------

    if (
      !sessionId ||
      !wallpaperId
    ) {

      return NextResponse.json(
        {
          error:
            "Missing parameters.",
        },
        { status: 400 }
      );
    }

    // ------------------------
    // VERIFY STRIPE PAYMENT
    // ------------------------

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (
      session.payment_status !==
      "paid"
    ) {

      return NextResponse.json(
        {
          error:
            "Payment not completed.",
        },
        { status: 402 }
      );
    }

    // ------------------------
    // PREVENT REUSE
    // ------------------------

    const {
      data: existingTx,
    } = await supabase
      .from(
        "premium_transactions"
      )
      .select("claimed")
      .eq(
        "stripe_session_id",
        sessionId
      )
      .single();

    if (
      existingTx?.claimed
    ) {

      return NextResponse.json(
        {
          error:
            "This secure link has already been consumed.",
        },
        { status: 403 }
      );
    }

    // ------------------------
    // FETCH WALLPAPER
    // ------------------------

    const {
      data: wallpaper,
      error: wallpaperError,
    } = await supabase
      .from("wallpapers")
      .select(`
        id,
        title,
        slug,
        image_url
      `)
      .eq("id", wallpaperId)
      .single();

    if (
      wallpaperError ||
      !wallpaper
    ) {

      return NextResponse.json(
        {
          error:
            "Wallpaper not found.",
        },
        { status: 404 }
      );
    }

    // ------------------------
    // EXACT R2 OBJECT KEY
    // ------------------------

    const imageUrl =
      wallpaper.image_url;

    const fileName =
      imageUrl
        .split("/")
        .pop()
        ?.split("?")[0];

    if (!fileName) {

      return NextResponse.json(
        {
          error:
            "Invalid R2 object key.",
        },
        { status: 500 }
      );
    }

    console.log(
      "FINAL R2 KEY:",
      fileName
    );

    console.log(
      "BUCKET:",
      process.env.R2_BUCKET_NAME
    );

    // ------------------------
    // GENERATE SIGNED URL
    // ------------------------

    const signedUrl =
      await getSignedUrl(
        r2,

        new GetObjectCommand({
          Bucket:
            process.env
              .R2_BUCKET_NAME!,

          Key: fileName,
        }),

        {
          expiresIn: 60,
        }
      );

    console.log(
      "SIGNED URL GENERATED"
    );

    // ------------------------
    // MARK CLAIMED
    // ------------------------

    await supabase
      .from(
        "premium_transactions"
      )
      .upsert({
        stripe_session_id:
          sessionId,

        wallpaper_id:
          wallpaperId,

        claimed: true,
      });

    // ------------------------
    // SUCCESS
    // ------------------------

    return NextResponse.json({
      downloadUrl:
        signedUrl,
    });

  } catch (error: any) {

    console.error(
      "PREMIUM DOWNLOAD ERROR:"
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal server error",
      },
      { status: 500 }
    );
  }
}