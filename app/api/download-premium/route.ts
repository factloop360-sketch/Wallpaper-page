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
// PREMIUM DOWNLOAD
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
            "Missing required parameters.",
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
    // CHECK CLAIM STATUS
    // ------------------------

    const {
      data: transaction,
      error: txError,
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

    if (txError) {

      console.log(
        "Transaction lookup:",
        txError.message
      );
    }

    // Prevent reuse
    if (transaction?.claimed) {

      return NextResponse.json(
        {
          error:
            "This secure download link has already been consumed.",
        },
        { status: 403 }
      );
    }

    // ------------------------
    // FETCH WALLPAPER
    // ------------------------

    const {
      data: wp,
      error: wpError,
    } = await supabase
      .from("wallpapers")
      .select("image_url")
      .eq("id", wallpaperId)
      .single();

    if (wpError || !wp) {

      return NextResponse.json(
        {
          error:
            "Wallpaper not found.",
        },
        { status: 404 }
      );
    }

    // ------------------------
    // EXTRACT R2 FILE PATH
    // ------------------------

    const url =
      new URL(wp.image_url);

    const fileName =
      decodeURIComponent(
        url.pathname.substring(1)
      );

    console.log({
      fileName,
      bucket:
        process.env.R2_BUCKET_NAME,
    });

    // ------------------------
    // GENERATE R2 SIGNED URL
    // ------------------------

    const signedUrl =
      await getSignedUrl(
        r2,

        new GetObjectCommand({
          Bucket:
            process.env
              .R2_BUCKET_NAME,

          Key: fileName,
        }),

        {
          expiresIn: 60,
        }
      );

    // ------------------------
    // MARK TRANSACTION CLAIMED
    // ------------------------

    const {
      error: claimError,
    } = await supabase
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

    if (claimError) {

      console.error(
        "Claim update failed:",
        claimError
      );
    }

    // ------------------------
    // SUCCESS
    // ------------------------

    return NextResponse.json({
      downloadUrl:
        signedUrl,
    });

  } catch (error: any) {

    console.error(
      "Premium download route failed:"
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