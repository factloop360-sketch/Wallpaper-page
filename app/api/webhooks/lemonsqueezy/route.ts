import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Service Role Key is strictly required to bypass Row Level Security 
// and write directly to your database from the backend.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

    // Cryptographically verify that this request actually came from Lemon Squeezy
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (
      digest.length !== signatureBuffer.length || 
      !crypto.timingSafeEqual(new Uint8Array(digest), new Uint8Array(signatureBuffer))
    ) {
       return NextResponse.json({ error: "Intruder detected. Invalid signature." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Only process completed orders
    if (payload.meta.event_name === "order_created") {
      const orderId = payload.data.id; // Lemon Squeezy Order ID string
      const wallpaperId = payload.meta.custom_data?.wallpaper_id; // Our secretly attached data

      if (!wallpaperId) {
        throw new Error("Missing wallpaper_id in checkout metadata.");
      }

      // Insert directly into your unlinked premium_transactions table
      // We map the Lemon Squeezy order_id to your existing stripe_session_id column
      const { error } = await supabaseAdmin.from('premium_transactions').insert({
        stripe_session_id: orderId, 
        wallpaper_id: wallpaperId,
        claimed: false
      });

      if (error) throw error;
    }

    return NextResponse.json({ message: "Transaction securely logged." }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook verification failed." }, { status: 500 });
  }
}