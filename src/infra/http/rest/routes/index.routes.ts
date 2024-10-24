import { app } from '@/app';
import { createCaloriesRoutes } from './calories.routes';
import { createCheckoutPixRoutes } from './checkout.pix.routes';
import { createCheckoutRoutes } from './checkout.routes';
import { createDietRoutes } from './diet.routes';
import { findPaymentSessionBySessionId } from './find.session.payment.by.session.id.routes';
import { webhookPixRoutes } from './webhook.pix.routes';
import { webhookRoutes } from './weebhook.routes';

export async function appRoutes() {
  app.register(createCaloriesRoutes, { prefix: '/calculate-calories' });
  app.register(createDietRoutes, { prefix: '/api/gemini' });
  app.register(createCheckoutRoutes, { prefix: '/checkout-card' });
  app.register(createCheckoutPixRoutes, { prefix: '/checkout-pix' });
  app.register(webhookRoutes, { prefix: '/webhooks/stripe' });
  app.register(webhookPixRoutes, { prefix: '/webhooks/mercadopago' });
  app.register(findPaymentSessionBySessionId, {
    prefix: '/find-payment-session',
  });
}
