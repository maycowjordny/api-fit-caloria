import cors from '@fastify/cors';
import 'dotenv/config';
import fastify from 'fastify';
import fastifyRawBody from 'fastify-raw-body';
import { appRoutes } from './infra/http/rest/routes/index.routes';
export const app = fastify();

app.register(fastifyRawBody, {
  field: 'rawBody',
  global: false,
  encoding: 'utf8',
  runFirst: true,
});

app.register(appRoutes);
app.register(cors, {
  origin: '*',
});
