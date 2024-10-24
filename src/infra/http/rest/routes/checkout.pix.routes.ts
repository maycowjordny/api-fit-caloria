import { FastifyInstance } from 'fastify';
import { CreateCheckoutPixController } from '../controller/create-checkout-pix-controller';

const createCheckoutPixController = new CreateCheckoutPixController();

export async function createCheckoutPixRoutes(app: FastifyInstance) {
  app.post('/', createCheckoutPixController.create);
}
