import { makeWebhookPix } from '@/application/factory/webhook/make-webhook-pix-factory';
import { PaymentNotification } from '@/domain/interfaces/webhook';
import { FastifyReply, FastifyRequest } from 'fastify';

export class WebhookPixController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { data, type } = request.body as PaymentNotification;

      const makeWebhookPixUseCase = makeWebhookPix();

      await makeWebhookPixUseCase.execute({ data, type });

      reply.status(200).send('OK');
    } catch (err: any) {
      console.error('Erro ao processar o webhook:', err.message || err);
      return reply.status(500).send({
        message: `Erro ao processar o webhook: ${err.message || 'Erro desconhecido'}`,
        ok: false,
      });
    }
  };
}
