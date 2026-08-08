import Stripe from "stripe";

export function getStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export const DYNAMIC_QR_PRICE_CENTS = 490;
export const DYNAMIC_QR_CURRENCY = "eur";

export interface CheckoutSessionInput {
  destinationUrl: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  stripe: Stripe,
  input: CheckoutSessionInput,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: DYNAMIC_QR_CURRENCY,
          unit_amount: DYNAMIC_QR_PRICE_CENTS,
          product_data: {
            name: "Dynamic QR",
            description:
              "One permanent QR code you can update anytime — no subscription",
          },
        },
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      destination_url: input.destinationUrl,
    },
  });
}

export async function retrievePaidCheckoutSession(
  stripe: Stripe,
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return null;
  }

  return session;
}

export function verifyWebhookEvent(
  stripe: Stripe,
  payload: string,
  signature: string,
  webhookSecret: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
