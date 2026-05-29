import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUser } from "@/lib/auth";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Only allow these price IDs
function getAllowedPriceIds(): Set<string> {
  const ids = new Set<string>();
  const starter = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
  const pro = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  const agency = process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID;
  if (starter) ids.add(starter);
  if (pro) ids.add(pro);
  if (agency) ids.add(agency);
  return ids;
}

export async function POST(req: NextRequest) {
  // Server-side auth — derive userId from session, not request body
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Validate priceId against allowlist
    const allowed = getAllowedPriceIds();
    if (!allowed.has(priceId)) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://repurposely.co";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/settings?cancelled=true`,
      customer_email: user.email || undefined,
      metadata: { user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", errMsg);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
