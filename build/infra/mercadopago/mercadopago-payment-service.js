"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infra/mercadopago/mercadopago-payment-service.ts
var mercadopago_payment_service_exports = {};
__export(mercadopago_payment_service_exports, {
  MercadoPagoPaymentService: () => MercadoPagoPaymentService
});
module.exports = __toCommonJS(mercadopago_payment_service_exports);

// src/lib/mercadopago/mercadopago.ts
var import_mercadopago = __toESM(require("mercadopago"));
if (!process.env.MERCADO_PAGO_SECRET_KEY) {
  throw new Error("MERCADO_PAGO_SECRET_KEY is missing. Please set the environment variable.");
}
var mercadoPagoClient = new import_mercadopago.default({
  accessToken: process.env.MERCADO_PAGO_SECRET_KEY
});
var preference = new import_mercadopago.Preference(mercadoPagoClient);
var payment = new import_mercadopago.Payment({
  accessToken: process.env.MERCADO_PAGO_SECRET_KEY
});

// src/infra/mercadopago/mercadopago-payment-service.ts
var import_crypto = require("crypto");
var MercadoPagoPaymentService = class {
  async createCheckoutPixSession(email) {
    return preference.create({
      body: {
        items: [
          {
            id: (0, import_crypto.randomUUID)(),
            title: "P\xE1gina Fit-caloria",
            description: "Crie sua dieta personalizada",
            quantity: 1,
            unit_price: 4.99
          }
        ],
        external_reference: (0, import_crypto.randomUUID)(),
        notification_url: "https://api-fit-caloria.onrender.com/webhooks/mercadopago",
        back_urls: {
          success: "https://www.fit-caloria.com.br",
          failure: "https://www.fit-caloria.com.br",
          pending: "https://www.fit-caloria.com.br"
        },
        auto_return: "approved",
        payer: {
          email
        }
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MercadoPagoPaymentService
});
