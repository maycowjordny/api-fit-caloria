import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { Prisma } from '@prisma/client';
import { PaymentSessionMapper } from './payment-session-mapper';

export class CreatePaymentSessionMapper extends PaymentSessionMapper {
  static toPrisma(paymentsession: PaymentSession): Prisma.PaymentSessionCreateInput {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email ?? undefined,
      isPaid: paymentsession.isPaid,
      paymentType: paymentsession.paymentType,
    };
  }
}
