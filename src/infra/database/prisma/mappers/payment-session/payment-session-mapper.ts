import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentTypeEnum } from '@/domain/enum/payment-type';
import { PaymentSession as RawPaymentSession } from '@prisma/client';

export class PaymentSessionMapper {
  static toDomain(rawPaymentSession: RawPaymentSession): PaymentSession {
    return new PaymentSession({
      id: rawPaymentSession.id,
      sessionId: rawPaymentSession.sessionId,
      email: rawPaymentSession.email,
      isPaid: rawPaymentSession.isPaid,
      paymentType: rawPaymentSession.paymentType as PaymentTypeEnum,
      createdAt: rawPaymentSession.createdAt,
      updatedAt: rawPaymentSession.updatedAt,
    });
  }
}
