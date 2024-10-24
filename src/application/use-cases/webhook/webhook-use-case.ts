import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentTypeEnum } from '@/domain/enum/payment-type';
import { WebHookInput } from '@/domain/interfaces/webhook';
import { stripe } from '@/lib/stripe/stripe';
import Stripe from 'stripe';
import { CreatePaymentSessionUseCase } from '../payment-session/create-payment-session';
import { UpdatePaymentSessionUseCase } from '../payment-session/update-payment-session';
import { SecretException } from './errors/secret-exception';
import { WebhookException } from './errors/webhook-exception';

export class WebHookUseCase {
  constructor(
    private createPaymentSessionUseCase: CreatePaymentSessionUseCase,
    private updatePaymentSessionUseCase: UpdatePaymentSessionUseCase
  ) {}

  async execute({ body, signature, event }: WebHookInput) {
    try {
      const secret: string = process.env.STRIPE_WEBHOOK_SECRET_KEY!;

      if (secret) {
        try {
          event = stripe.webhooks.constructEvent(body!, signature, secret);
        } catch (err: any) {
          throw new SecretException(err);
        }
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.payment_status === 'paid') {
            // Pagamento por cartão com sucesso
            const session = event.data.object as Stripe.Checkout.Session;

            const sessionInput = PaymentSession.create({
              email: session.customer_details?.email!,
              isPaid: true,
              sessionId: session.id,
              paymentType: PaymentTypeEnum.CARD,
            });

            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }

          if (event.data.object.payment_status === 'unpaid' && event.data.object.payment_intent) {
            // Pagamento por boleto
            const paymentIntent = await stripe.paymentIntents.retrieve(
              event.data.object.payment_intent.toString()
            );

            if (paymentIntent) {
              const sessionInput = PaymentSession.create({
                email: session.customer_details?.email!,
                isPaid: false,
                sessionId: session.id,
                paymentType: PaymentTypeEnum.BOLETO,
              });

              return await this.createPaymentSessionUseCase.execute(sessionInput);
            }
          }
          break;
        }

        case 'checkout.session.async_payment_succeeded':
          if (event.data.object.payment_status === 'paid') {
            // O cliente pagou o boleto e o pagamento foi confirmado
            const session = event.data.object as Stripe.Checkout.Session;

            const sessionInput = PaymentSession.create({
              email: session.customer_details?.email!,
              isPaid: true,
              sessionId: session.id,
              paymentType: PaymentTypeEnum.BOLETO,
            });

            return await this.updatePaymentSessionUseCase.execute(sessionInput);
          }
          break;
        case 'checkout.session.async_payment_failed':
          if (event.data.object.payment_status === 'unpaid') {
            // O cliente pagou não boleto e ele venceu
            const session = event.data.object as Stripe.Checkout.Session;
          }
          break;

        default:
      }
    } catch (err) {
      throw new WebhookException(err);
    }
  }
}
