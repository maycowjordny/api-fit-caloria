import Stripe from 'stripe';

export interface WebHookInput {
  event: Stripe.Event;
  body: string | Buffer | undefined;
  signature: string;
}

export interface PaymentNotification {
  type: string;
  data: {
    id: string;
  };
}
