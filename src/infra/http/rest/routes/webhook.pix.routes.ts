import { FastifyInstance } from 'fastify';
import { WebhookPixController } from '../controller/webhook-pix-controller';
const webhookPixController = new WebhookPixController();

export async function webhookPixRoutes(app: FastifyInstance) {
  app.post('/', webhookPixController.create);
}
