import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe (You will add STRIPE_SECRET_KEY to your Vercel/local .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia" as any,
});

export async function POST(req: Request) {
  try {
    const { wallpaperId, wallpaperTitle, wallpaperSlug, price = 199 } = await req.json();

    // The URL the user returns to after successfully paying
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/wallpaper/${wallpaperSlug}?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
     // payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Premium Asset: ${wallpaperTitle}`,
              description: "One-time secure high-resolution download.",
            },
            unit_amount: price, // $1.99 = 199 cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: returnUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wallpaper/${wallpaperSlug}`,
      metadata: {
        wallpaperId: wallpaperId, // Pass the ID secretly so our backend knows what they bought
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}