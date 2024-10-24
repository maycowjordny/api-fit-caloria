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

// src/infra/http/rest/controller/webhook-pix-controller.ts
var webhook_pix_controller_exports = {};
__export(webhook_pix_controller_exports, {
  WebhookPixController: () => WebhookPixController
});
module.exports = __toCommonJS(webhook_pix_controller_exports);

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

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/payment-session/errors/create-payment-session-exception.ts
var CreatePaymentSessionException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar sess\xE3o de pagamento: ${err}.`);
    this.name = "CreatePaymentSessionException";
  }
};

// src/application/use-cases/payment-session/create-payment-session.ts
var CreatePaymentSessionUseCase = class {
  constructor(paymentSessionRepository) {
    this.paymentSessionRepository = paymentSessionRepository;
  }
  async execute(inputPaymentSession) {
    try {
      const paymentsession = PaymentSession.create({
        ...inputPaymentSession.props
      });
      return await this.paymentSessionRepository.create(paymentsession);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
  }
};

// src/application/use-cases/payment-session/errors/update-payment-session-exception.ts
var UpdatePaymentSessionException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao atualizar sess\xE3o de pagamento: ${err}.`);
    this.name = "UpdatePaymentSessionException";
  }
};

// src/application/use-cases/payment-session/update-payment-session.ts
var UpdatePaymentSessionUseCase = class {
  constructor(paymentSessionRepository) {
    this.paymentSessionRepository = paymentSessionRepository;
  }
  async execute(inputPaymentSession) {
    try {
      const paymentsession = PaymentSession.create({ ...inputPaymentSession.props });
      return await this.paymentSessionRepository.update(paymentsession);
    } catch (err) {
      throw new UpdatePaymentSessionException(err);
    }
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

// src/lib/prisma/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "dev" ? [] : []
});

// src/infra/database/prisma/mappers/payment-session/payment-session-mapper.ts
var PaymentSessionMapper = class {
  static toDomain(rawPaymentSession) {
    return new PaymentSession({
      id: rawPaymentSession.id,
      sessionId: rawPaymentSession.sessionId,
      email: rawPaymentSession.email,
      isPaid: rawPaymentSession.isPaid,
      paymentType: rawPaymentSession.paymentType,
      createdAt: rawPaymentSession.createdAt,
      updatedAt: rawPaymentSession.updatedAt
    });
  }
};

// src/infra/database/prisma/mappers/payment-session/create-payment-session-mapper.ts
var CreatePaymentSessionMapper = class extends PaymentSessionMapper {
  static toPrisma(paymentsession) {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email ?? void 0,
      isPaid: paymentsession.isPaid,
      paymentType: paymentsession.paymentType
    };
  }
};

// src/infra/database/prisma/mappers/payment-session/update-payment-session-mapper.ts
var UpdatePaymentSessionMapper = class extends PaymentSessionMapper {
  static toPrisma(paymentsession) {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email,
      isPaid: paymentsession.isPaid,
      paymentType: paymentsession.paymentType
    };
  }
};

// src/infra/database/prisma/repositories/prisma-payment-session-repository.ts
var PrismaPaymentSessionRepository = class {
  async create(data) {
    const result = await prisma.paymentSession.create({
      data: CreatePaymentSessionMapper.toPrisma(data)
    });
    return PaymentSessionMapper.toDomain(result);
  }
  async update(data) {
    const result = await prisma.paymentSession.update({
      where: {
        sessionId: data.sessionId
      },
      data: UpdatePaymentSessionMapper.toPrisma(data)
    });
    return PaymentSessionMapper.toDomain(result);
  }
  async findBySessionId(sessionId) {
    const result = await prisma.paymentSession.findUnique({
      where: {
        sessionId
      }
    });
    return result && PaymentSessionMapper.toDomain(result);
  }
};

// src/application/factory/webhook/make-webhook-pix-factory.ts
function makeWebhookPix() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const createPaymentSession = new CreatePaymentSessionUseCase(paymentSessionRepository);
  const updatePaymentSession = new UpdatePaymentSessionUseCase(paymentSessionRepository);
  const webhookUseCase = new WebHookPixUseCase(createPaymentSession, updatePaymentSession);
  return webhookUseCase;
}

// src/infra/http/rest/controller/webhook-pix-controller.ts
var WebhookPixController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const { data, type } = request.body;
        const makeWebhookPixUseCase = makeWebhookPix();
        await makeWebhookPixUseCase.execute({ data, type });
        reply.status(200).send("OK");
      } catch (err) {
        console.error("Erro ao processar o webhook:", err.message || err);
        return reply.status(500).send({
          message: `Erro ao processar o webhook: ${err.message || "Erro desconhecido"}`,
          ok: false
        });
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebhookPixController
});
