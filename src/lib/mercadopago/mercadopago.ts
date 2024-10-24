import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';

if (!process.env.MERCADO_PAGO_SECRET_KEY) {
  throw new Error('MERCADO_PAGO_SECRET_KEY is missing. Please set the environment variable.');
}

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_SECRET_KEY,
});

export const preference = new Preference(mercadoPagoClient);
export const payment = new Payment({
  accessToken: process.env.MERCADO_PAGO_SECRET_KEY,
});
