import { makefindPaymentSessionBySessionId } from '@/application/factory/find-session-payment-by-session-id/make-find-session-payment-by-session-id-';
import { FindPaymentSessionBySessionIdException } from '@/application/use-cases/payment-session/errors/find-payment-session-by-session-id-exception';
import { FastifyReply, FastifyRequest } from 'fastify';

export class FindPaymentSessionBySessionIdController {
  public find = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.body as { sessionId: string };

      const makefindPaymentSessionBySessionIdUseCase = makefindPaymentSessionBySessionId();

      const session = await makefindPaymentSessionBySessionIdUseCase.execute(sessionId);

      return reply.status(201).send({ session });
    } catch (err: any) {
      return reply.status(err instanceof FindPaymentSessionBySessionIdException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
