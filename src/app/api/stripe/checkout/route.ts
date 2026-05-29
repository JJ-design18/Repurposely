import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, email } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "Price ID and user ID are required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://repurposely-peach.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/settings?cancelled=true`,
      customer_email: email || undefined,
      metadata: { user_id: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", errMsg);
    return NextResponse.json(
      { error: `Checkout failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
