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

// src/application/use-cases/webhook/webhook-pix-use-case.ts
var webhook_pix_use_case_exports = {};
__export(webhook_pix_use_case_exports, {
  WebHookPixUseCase: () => WebHookPixUseCase
});
module.exports = __toCommonJS(webhook_pix_use_case_exports);

// src/core/domain/Entity.ts
var Entity = class {
  constructor(props) {
    this.props = props;
  }
  equals(object) {
    if (object === null || object === void 0) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return false;
  }
};

// src/domain/entities/payment-session-entity.ts
var PaymentSession = class _PaymentSession extends Entity {
  get id() {
    return this.props.id;
  }
  get sessionId() {
    return this.props.sessionId;
  }
  get isPaid() {
    return this.props.isPaid;
  }
  get paymentType() {
    return this.props.paymentType;
  }
  get email() {
    return this.props.email;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  static create(props) {
    const paymentsession = new _PaymentSession({
      ...props
    });
    return paymentsession;
  }
};

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

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/webhook/errors/webhook-pix-exception.ts
var WebhookPixException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao se comunicar com o webhook Pix: ${err}.`);
    this.name = "WebhookPixException";
  }
};

// src/application/use-cases/webhook/webhook-pix-use-case.ts
var WebHookPixUseCase = class {
  constructor(createPaymentSessionUseCase, updatePaymentSessionUseCase) {
    this.createPaymentSessionUseCase = createPaymentSessionUseCase;
    this.updatePaymentSessionUseCase = updatePaymentSessionUseCase;
  }
  async execute({ data, type }) {
    try {
      if (type === "payment") {
        const paymentId = data.id;
        const paymentResponse = await payment.get({ id: paymentId });
        const paymentStatus = paymentResponse.response?.status || paymentResponse.status;
        if (paymentStatus === "approved") {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: true,
            sessionId: String(paymentResponse.id),
            paymentType: "PIX" /* PIX */
          });
          return await this.updatePaymentSessionUseCase.execute(sessionInput);
        } else if (paymentStatus === "pending") {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: false,
            sessionId: String(paymentResponse.id),
            paymentType: "PIX" /* PIX */
          });
          return await this.createPaymentSessionUseCase.execute(sessionInput);
        } else if (paymentStatus === "rejected") {
          const sessionInput = PaymentSession.create({
            email: paymentResponse.payer.email || null,
            isPaid: false,
            sessionId: String(paymentResponse.id),
            paymentType: "PIX" /* PIX */
          });
          return await this.createPaymentSessionUseCase.execute(sessionInput);
        }
      }
    } catch (err) {
      console.log(err.message);
      throw new WebhookPixException(err);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebHookPixUseCase
});
