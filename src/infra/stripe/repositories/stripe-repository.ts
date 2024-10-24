import Stripe from 'stripe';

export interface StripeRepository {
  createCheckoutSession(email: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
