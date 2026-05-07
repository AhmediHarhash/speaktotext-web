import { NextResponse } from 'next/server';

type PlanId = 'monthly' | 'yearly';

const allowedPlans = new Set<PlanId>(['monthly', 'yearly']);

type StripeSessionResponse = {
  url?: string;
  error?: {
    message?: string;
  };
};

function getPlanConfig(plan: PlanId) {
  const configs = {
    monthly: {
      priceId: process.env.STRIPE_MONTHLY_PRICE_ID,
      couponId: process.env.STRIPE_MONTHLY_COUPON_ID
    },
    yearly: {
      priceId: process.env.STRIPE_YEARLY_PRICE_ID,
      couponId: process.env.STRIPE_YEARLY_COUPON_ID
    }
  } satisfies Record<
    PlanId,
    { priceId: string | undefined; couponId: string | undefined }
  >;

  const config = configs[plan];

  if (!config.priceId) {
    throw new Error(`Missing Stripe price id for ${plan}.`);
  }

  return {
    priceId: config.priceId,
    couponId: config.couponId
  };
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY.');
    }

    const body = (await request.json()) as { plan?: PlanId };
    const plan = body.plan;

    if (!plan || !allowedPlans.has(plan)) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const planConfig = getPlanConfig(plan);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const params = new URLSearchParams({
      mode: 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': planConfig.priceId,
      'line_items[0][quantity]': '1',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      allow_promotion_codes: 'false',
      billing_address_collection: 'auto',
      'metadata[plan]': plan,
      'subscription_data[metadata][plan]': plan
    });

    if (planConfig.couponId) {
      params.set('discounts[0][coupon]', planConfig.couponId);
    }

    const stripeResponse = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }
    );

    const payload = (await stripeResponse.json()) as StripeSessionResponse;

    if (!stripeResponse.ok || !payload.url) {
      throw new Error(
        payload.error?.message ?? 'Unable to start checkout.'
      );
    }

    return NextResponse.json({ url: payload.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to start checkout.';

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Unable to start checkout.' },
      { status: 500 }
    );
  }
}
