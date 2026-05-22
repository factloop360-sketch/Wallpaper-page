import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // The frontend button sends these exact fields
    const { wallpaperId, wallpaperTitle, wallpaperSlug, price } = await req.json();

    if (!wallpaperId || !wallpaperSlug || !price) {
      return NextResponse.json({ error: "Missing required asset data." }, { status: 400 });
    }

    // 🚨 The critical redirect URL. Lemon Squeezy will automatically swap 
    // [order_id] with the real ID before sending the user back to your page!
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/wallpaper/${wallpaperSlug}?orderId=[order_id]`;

    // Talk to the Lemon Squeezy API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: price, // Dynamically set the price (in cents) from your DB
            checkout_data: {
              custom: {
                wallpaper_id: wallpaperId, // Secretly attached so the webhook can read it
              },
            },
            product_options: {
              name: `Premium Asset: ${wallpaperTitle}`,
              redirect_url: returnUrl, 
              receipt_button_text: "Return to Download",
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: process.env.LEMONSQUEEZY_VARIANT_ID },
            },
          },
        },
      }),
    });

    const checkoutData = await response.json();

    if (checkoutData.errors) {
      throw new Error(checkoutData.errors[0].detail);
    }

    // Hand the secure Lemon Squeezy URL back to the frontend button
    return NextResponse.json({ url: checkoutData.data.attributes.url });

  } catch (error: any) {
    console.error("Checkout Engine Error:", error);
    return NextResponse.json({ error: "Failed to initialize secure gateway." }, { status: 500 });
  }
}