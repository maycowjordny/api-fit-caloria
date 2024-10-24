import { StripeRepository } from '@/infra/stripe/repositories/stripe-repository';
import Stripe from 'stripe';
import { CreateCheckoutException } from '../errors/create-checkout-exception';
import { EmailNotProvidedException } from '../errors/email-not-provided-exception';

export class CreateCheckoutUseCase {
  constructor(private stripeRepository: StripeRepository) {}

  async execute(email: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    try {
      if (!email) throw new EmailNotProvidedException();
      return this.stripeRepository.createCheckoutSession(email);
    } catch (err) {
      throw new CreateCheckoutException(err);
    }
  }
}
