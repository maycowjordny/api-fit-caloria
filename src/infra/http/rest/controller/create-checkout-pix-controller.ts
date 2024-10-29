import { makeCreateCheckoutPix } from '@/application/factory/checkout/pix/make-create-checkout-pix';
import { CreateCheckoutException } from '@/application/use-cases/checkout/errors/create-checkout-exception';
import { FastifyReply, FastifyRequest } from 'fastify';

export class CreateCheckoutPixController {
  public create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email } = request.body as { email: string };

      const createCheckoutUseCase = makeCreateCheckoutPix();

      const session = await createCheckoutUseCase.execute(email);

      reply.status(200).send({ id: session.external_reference, url: session.init_point });
    } catch (err) {
      return reply.status(err instanceof CreateCheckoutException ? 500 : 409).send({
        name: (err as Error).name,
        message: (err as Error).message,
      });
    }
  };
}
