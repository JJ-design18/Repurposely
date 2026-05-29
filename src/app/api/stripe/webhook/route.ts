import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Build price-to-plan map from env vars (live price IDs)
function getPlanMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const starter = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
  const pro = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  const agency = process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID;
  if (starter) map[starter] = "starter";
  if (pro) map[pro] = "pro";
  if (agency) map[agency] = "agency";
  return map;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const PLAN_MAP = getPlanMap();

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const userId = session.metadata?.user_id;

      if (userId && subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = PLAN_MAP[priceId] || "free";

        const { error } = await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            generations_used: 0,
          })
          .eq("id", userId);

        if (error) {
          console.error("Supabase update failed (checkout):", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = PLAN_MAP[priceId] || "free";

      const { error } = await supabase
        .from("profiles")
        .update({ plan })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("Supabase update failed (sub update):", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("Supabase update failed (sub delete):", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
