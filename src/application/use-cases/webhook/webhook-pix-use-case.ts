import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentTypeEnum } from '@/domain/enum/payment-type';
import { payment } from '@/lib/mercadopago/mercadopago';
import { CreatePaymentSessionUseCase } from '../payment-session/create-payment-session';
import { UpdatePaymentSessionUseCase } from '../payment-session/update-payment-session';
import { WebhookPixException } from './errors/webhook-pix-exception';

export class WebHookPixUseCase {
  constructor(
    private createPaymentSessionUseCase: CreatePaymentSessionUseCase,
    private updatePaymentSessionUseCase: UpdatePaymentSessionUseCase
  ) {}
  async execute({ data, type }: any) {
    try {
      if (type === 'payment') {
        const paymentId = data.id;

        const paymentResponse: any = await payment.get({ id: paymentId });

        const paymentStatus: string = paymentResponse.response?.status || paymentResponse.status;

        if (paymentStatus === 'approved') {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: true,
            sessionId: String(paymentResponse.id),
            paymentType: PaymentTypeEnum.PIX,
          });

          return await this.updatePaymentSessionUseCase.execute(sessionInput);
        } else if (paymentStatus === 'pending') {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: false,
            sessionId: String(paymentResponse.id),
            paymentType: PaymentTypeEnum.PIX,
          });

          return await this.createPaymentSessionUseCase.execute(sessionInput);
        } else if (paymentStatus === 'rejected') {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: false,
            sessionId: String(paymentResponse.id),
            paymentType: PaymentTypeEnum.PIX,
          });

          return await this.createPaymentSessionUseCase.execute(sessionInput);
        }
      }
    } catch (err: any) {
      console.log(err.message);

      throw new WebhookPixException(err);
    }
  }
}
