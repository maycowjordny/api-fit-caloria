import { CreatePaymentSessionUseCase } from '@/application/use-cases/payment-session/create-payment-session';
import { UpdatePaymentSessionUseCase } from '@/application/use-cases/payment-session/update-payment-session';
import { WebHookPixUseCase } from '@/application/use-cases/webhook/webhook-pix-use-case';
import { PrismaPaymentSessionRepository } from '@/infra/database/prisma/repositories/prisma-payment-session-repository';

export function makeWebhookPix() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const createPaymentSession = new CreatePaymentSessionUseCase(paymentSessionRepository);
  const updatePaymentSession = new UpdatePaymentSessionUseCase(paymentSessionRepository);
  const webhookUseCase = new WebHookPixUseCase(createPaymentSession, updatePaymentSession);

  return webhookUseCase;
}
