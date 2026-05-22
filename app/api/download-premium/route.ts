import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { createClient } from "@supabase/supabase-js";

// ------------------------
// SUPABASE (Service Role)
// ------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ------------------------
// PREMIUM DOWNLOAD ROUTE
// ------------------------
export async function POST(req: Request) {
  try {
    // Note: We now expect 'orderId' from Lemon Squeezy instead of 'sessionId'
    const { orderId, wallpaperId } = await req.json();

    // ------------------------
    // VALIDATION
    // ------------------------
    if (!orderId || !wallpaperId) {
      return NextResponse.json(
        { error: "Missing parameters." },
        { status: 400 }
      );
    }

    // ------------------------
    // VERIFY PAYMENT IN DATABASE
    // ------------------------
    // We don't need to call Stripe/Lemon Squeezy here. 
    // If the Webhook put it in the database, it is paid and valid.
    const { data: existingTx, error: txError } = await supabase
      .from("premium_transactions")
      .select("claimed")
      .eq("stripe_session_id", orderId) // Reusing your existing column for LS Order ID
      .eq("wallpaper_id", wallpaperId)
      .single();

    if (txError || !existingTx) {
      return NextResponse.json(
        { error: "Payment not found or not completed." },
        { status: 402 }
      );
    }

    // ------------------------
    // PREVENT REUSE
    // ------------------------
    if (existingTx.claimed) {
      return NextResponse.json(
        { error: "This secure link has already been consumed." },
        { status: 403 }
      );
    }

    // ------------------------
    // FETCH WALLPAPER
    // ------------------------
    const { data: wallpaper, error: wallpaperError } = await supabase
      .from("wallpapers")
      .select(`
        id,
        title,
        slug,
        image_url,
        vault_key
      `)
      .eq("id", wallpaperId)
      .single();

    if (wallpaperError || !wallpaper) {
      return NextResponse.json(
        { error: "Wallpaper not found." },
        { status: 404 }
      );
    }

    // ------------------------
    // EXACT R2 OBJECT KEY
    // ------------------------
    // Prefer the secure vault_key, but fallback to your old image_url parsing if needed
    let fileName = wallpaper.vault_key;

    if (!fileName && wallpaper.image_url) {
      fileName = wallpaper.image_url.split("/").pop()?.split("?")[0];
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "Invalid R2 object key." },
        { status: 500 }
      );
    }

    console.log("FINAL R2 KEY:", fileName);
    console.log("BUCKET:", process.env.R2_BUCKET_NAME);

    // ------------------------
    // GENERATE SIGNED URL
    // ------------------------
    const signedUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileName,
      }),
      { expiresIn: 60 }
    );

    console.log("SIGNED URL GENERATED");

    // ------------------------
    // MARK CLAIMED
    // ------------------------
    // We use update() instead of upsert() since we already know the row exists
    await supabase
      .from("premium_transactions")
      .update({ claimed: true })
      .eq("stripe_session_id", orderId);

    // ------------------------
    // SUCCESS
    // ------------------------
    return NextResponse.json({
      downloadUrl: signedUrl,
    });

  } catch (error: any) {
    console.error("PREMIUM DOWNLOAD ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}