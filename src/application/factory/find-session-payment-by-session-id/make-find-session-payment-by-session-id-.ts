import { FindPaymentSessionBySessionIdUseCase } from '@/application/use-cases/payment-session/find-payment-session-by-session-id';
import { PrismaPaymentSessionRepository } from '@/infra/database/prisma/repositories/prisma-payment-session-repository';

export function makefindPaymentSessionBySessionId() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();

  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(
    paymentSessionRepository
  );

  return findPaymentSessionBySessionIdUseCase;
}
