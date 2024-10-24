import { CreateDietUseCase } from '@/application/use-cases/diet/create-diet-use-case';
import { FindPaymentSessionBySessionIdUseCase } from '@/application/use-cases/payment-session/find-payment-session-by-session-id';
import { PrismaPaymentSessionRepository } from '@/infra/database/prisma/repositories/prisma-payment-session-repository';

export function makeCreateDiet() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();

  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(
    paymentSessionRepository
  );

  const createDietUseCase = new CreateDietUseCase(findPaymentSessionBySessionIdUseCase);

  return createDietUseCase;
}
