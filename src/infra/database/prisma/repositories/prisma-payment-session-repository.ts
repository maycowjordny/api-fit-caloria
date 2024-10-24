import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { prisma } from '@/lib/prisma/prisma';
import { PaymentSessionRepository } from '../../repositories/payment-session-repository';
import { CreatePaymentSessionMapper } from '../mappers/payment-session/create-payment-session-mapper';
import { PaymentSessionMapper } from '../mappers/payment-session/payment-session-mapper';
import { UpdatePaymentSessionMapper } from '../mappers/payment-session/update-payment-session-mapper';

export class PrismaPaymentSessionRepository implements PaymentSessionRepository {
  async create(data: PaymentSession): Promise<PaymentSession> {
    const result = await prisma.paymentSession.create({
      data: CreatePaymentSessionMapper.toPrisma(data),
    });

    return PaymentSessionMapper.toDomain(result);
  }

  async update(data: PaymentSession): Promise<PaymentSession> {
    const result = await prisma.paymentSession.update({
      where: {
        sessionId: data.sessionId,
      },
      data: UpdatePaymentSessionMapper.toPrisma(data),
    });

    return PaymentSessionMapper.toDomain(result);
  }

  async findBySessionId(sessionId: string): Promise<PaymentSession | null> {
    const result = await prisma.paymentSession.findUnique({
      where: {
        sessionId,
      },
    });

    return result && PaymentSessionMapper.toDomain(result);
  }
}
