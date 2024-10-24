import { PaymentSession } from '@/domain/entities/payment-session-entity';

export interface PaymentSessionRepository {
  create(data: PaymentSession): Promise<PaymentSession>;
  update(data: PaymentSession): Promise<PaymentSession>;
  findBySessionId(sessionId?: string): Promise<PaymentSession | null>;
}
