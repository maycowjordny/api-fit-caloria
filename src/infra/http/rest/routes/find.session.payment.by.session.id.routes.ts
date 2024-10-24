import { FastifyInstance } from 'fastify';
import { FindPaymentSessionBySessionIdController } from '../controller/find-payment-session-by-session-id';

const findPaymentSessionBySessionIdController = new FindPaymentSessionBySessionIdController();

export async function findPaymentSessionBySessionId(app: FastifyInstance) {
  app.post('/', findPaymentSessionBySessionIdController.find);
}
