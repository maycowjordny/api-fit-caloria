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

// src/infra/http/rest/routes/index.routes.ts
var index_routes_exports = {};
__export(index_routes_exports, {
  appRoutes: () => appRoutes
});
module.exports = __toCommonJS(index_routes_exports);

// src/app.ts
var import_cors = __toESM(require("@fastify/cors"));
var import_axios = __toESM(require("axios"));
var import_config = require("dotenv/config");
var import_fastify = __toESM(require("fastify"));
var import_fastify_raw_body = __toESM(require("fastify-raw-body"));
var import_node_cron = __toESM(require("node-cron"));
var app = (0, import_fastify.default)();
app.get("/cron", async (request, reply) => {
  reply.status(200).send("ok");
});
import_node_cron.default.schedule("*/5 * * * *", async () => {
  try {
    await import_axios.default.get("https://api-calculator-calories-1.onrender.com/cron");
  } catch (error) {
    console.error("Error pinging server:", error);
  }
});
app.register(import_fastify_raw_body.default, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true
});
app.register(appRoutes);
app.register(import_cors.default, {
  origin: "*"
});

// src/utils/round-to-decimals.ts
function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

// src/utils/round-to-nearest-hundred.ts
function roundToNearestHundred(num) {
  return Math.round(num / 100) * 100;
}

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/diet/errors/create-calories-exception.ts
var CreateCaloriesException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar as calorias : ${err}.`);
    this.name = "CreateCalorieasException";
  }
};

// src/application/use-cases/diet/create-calories-use-case.ts
var CreateCaloriesUseCase = class {
  constructor() {
    this.basalMetabolicRate = 0;
  }
  async execute(inputCalories) {
    try {
      const { activity, age, gender, height, weight, weightGoal } = inputCalories;
      if (gender === "female") {
        this.basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age - 161;
      } else {
        this.basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + 5;
      }
      const totalCalories = this.basalMetabolicRate * activity;
      const totalCaloriesWithWeightGoal = weightGoal > weight ? totalCalories + 300 : totalCalories - totalCalories * 0.2;
      const protein = weight * 2;
      const fat = weight * 0.8;
      const carbs = (totalCaloriesWithWeightGoal - (protein * 4 + fat * 9)) / 4;
      const resultCaloriesRounded = roundToNearestHundred(totalCaloriesWithWeightGoal);
      const proteinRounded = roundToDecimals(protein);
      const fatRounded = roundToDecimals(fat);
      const carbsRounded = roundToDecimals(carbs);
      return {
        quantity: resultCaloriesRounded,
        protein: proteinRounded,
        fat: fatRounded,
        carbs: carbsRounded
      };
    } catch (err) {
      throw new CreateCaloriesException(err);
    }
  }
};

// src/application/factory/diet/make-create-calories-factory.ts
function makeCreateCalories() {
  const createCaloriesUseCase = new CreateCaloriesUseCase();
  return createCaloriesUseCase;
}

// src/infra/http/rest/controller/create-calories-controller.ts
var CreateCaloriesController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const makeCreateCaloriesUseCase = makeCreateCalories();
        const calories = await makeCreateCaloriesUseCase.execute(request.body);
        return reply.status(201).send({ calories });
      } catch (err) {
        return reply.status(err instanceof CreateCaloriesException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/calories.routes.ts
var createCaloriesController = new CreateCaloriesController();
async function createCaloriesRoutes(app2) {
  app2.post("/", createCaloriesController.create);
}

// src/application/use-cases/checkout/errors/create-checkout-pix-exception.ts
var CreateCheckoutPixException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao processar pagamento pix: ${err}.`);
    this.name = "CreateCheckoutPixException";
  }
};

// src/application/use-cases/checkout/errors/email-not-provided-exception.ts
var EmailNotProvidedException = class extends UseCaseError {
  constructor() {
    super(`E-mail para pagamento n\xE3o foi fornecido.`);
    this.name = "EmailNotProvidedException";
  }
};

// src/application/use-cases/checkout/pix/create-pix-checkout-use-case.ts
var CreateCheckoutPixUseCase = class {
  constructor(mercadopagoRepository) {
    this.mercadopagoRepository = mercadopagoRepository;
  }
  async execute(email) {
    try {
      if (!email) throw new EmailNotProvidedException();
      return this.mercadopagoRepository.createCheckoutPixSession(email);
    } catch (err) {
      throw new CreateCheckoutPixException(err);
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
        notification_url: "https://api-calculator-calories-1.onrender.com/webhooks/mercadopago",
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

// src/application/factory/checkout/pix/make-create-checkout-pix.ts
function makeCreateCheckoutPix() {
  const checkoutPixRepository = new MercadoPagoPaymentService();
  const createCheckoutPixUseCase = new CreateCheckoutPixUseCase(checkoutPixRepository);
  return createCheckoutPixUseCase;
}

// src/application/use-cases/checkout/errors/create-checkout-exception.ts
var CreateCheckoutException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao processar pagamento: ${err}.`);
    this.name = "CreateCheckoutException";
  }
};

// src/infra/http/rest/controller/create-checkout-pix-controller.ts
var CreateCheckoutPixController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const { email } = request.body;
        const createCheckoutUseCase = makeCreateCheckoutPix();
        const session = await createCheckoutUseCase.execute(email);
        reply.status(200).send({ url: session.init_point });
      } catch (err) {
        return reply.status(err instanceof CreateCheckoutException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/checkout.pix.routes.ts
var createCheckoutPixController = new CreateCheckoutPixController();
async function createCheckoutPixRoutes(app2) {
  app2.post("/", createCheckoutPixController.create);
}

// src/application/use-cases/checkout/credit-card/create-checkout-use-case.ts
var CreateCheckoutUseCase = class {
  constructor(stripeRepository) {
    this.stripeRepository = stripeRepository;
  }
  async execute(email) {
    try {
      if (!email) throw new EmailNotProvidedException();
      return this.stripeRepository.createCheckoutSession(email);
    } catch (err) {
      throw new CreateCheckoutException(err);
    }
  }
};

// src/lib/stripe/stripe.ts
var import_stripe = __toESM(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing. Please set the environment variable.");
}
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
  typescript: true
});

// src/infra/stripe/stripe-payment-service.ts
var StripePaymentService = class {
  async createCheckoutSession(email) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      customer_email: email,
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      success_url: `${process.env.BASE_URL}/`,
      cancel_url: `${process.env.BASE_URL}/`
    });
    return session;
  }
};

// src/application/factory/checkout/make-create-checkout.ts
function makeCreateCheckout() {
  const checkoutRepository = new StripePaymentService();
  const createCheckoutUseCase = new CreateCheckoutUseCase(checkoutRepository);
  return createCheckoutUseCase;
}

// src/infra/http/rest/controller/create-checkout-controller.ts
var CreateCheckoutController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const { email } = request.body;
        const createCheckoutUseCase = makeCreateCheckout();
        const session = await createCheckoutUseCase.execute(email);
        reply.status(200).send({ id: session.id, url: session.url });
      } catch (err) {
        return reply.status(err instanceof CreateCheckoutException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/checkout.routes.ts
var createCheckoutController = new CreateCheckoutController();
async function createCheckoutRoutes(app2) {
  app2.post("/", createCheckoutController.create);
}

// src/utils/format-diets.ts
function formatDiets(text) {
  let menus = text.split(/\*\*Card[aá]pio \d+:\*\*/).toString();
  return menus;
}

// src/application/use-cases/diet/create-diet-use-case.ts
var import_generative_ai = require("@google/generative-ai");

// src/application/use-cases/payment-session/errors/session-not-paid-exception.ts
var SessionNotPaidException = class extends UseCaseError {
  constructor() {
    super(
      `A sess\xE3o n\xE3o foi paga, e n\xE3o \xE9 poss\xEDvel gerar uma dieta personalizada sem excluir alimentos.`
    );
    this.name = "SessionNotPaidException";
  }
};

// src/application/use-cases/diet/errors/create-diet-exception.ts
var CreateDietException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar dieta: ${err}.`);
    this.name = "CreateDietException";
  }
};

// src/application/use-cases/diet/errors/diet-description-failed-exception.ts
var DietDescriptionFailedException = class extends UseCaseError {
  constructor() {
    super("Erro ao gerar dieta");
    this.name = "DietDescriptionFailedException";
  }
};

// src/application/use-cases/diet/create-diet-use-case.ts
var CreateDietUseCase = class {
  constructor(findPaymentSessionBySessionIdUseCase) {
    this.findPaymentSessionBySessionIdUseCase = findPaymentSessionBySessionIdUseCase;
  }
  async execute({ calories, excludedFoods, sessionId }) {
    try {
      const session = await this.findPaymentSessionBySessionIdUseCase.execute(sessionId);
      if (!session || !session.isPaid) throw new SessionNotPaidException();
      const dietDescription = await this.generateDietDescription(calories, excludedFoods);
      return { description: dietDescription };
    } catch (err) {
      throw new CreateDietException(err);
    }
  }
  async generateDietDescription(calories, excludedFoods) {
    const genAI = new import_generative_ai.GoogleGenerativeAI(process.env.API_KEY_GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const generateDiet = await model.generateContent(
      excludedFoods ? `${calories} calorias. Crie 1 card\xE1pio equilibrado com prote\xEDnas, carboidratos e gorduras saud\xE1veis, excluindo: ${excludedFoods}.` : `${calories} calorias. Crie 1 card\xE1pio equilibrado com prote\xEDnas, carboidratos e gorduras saud\xE1veis.`
    );
    const response = generateDiet.response;
    const dietDescription = response.text();
    if (!dietDescription) {
      throw new DietDescriptionFailedException();
    }
    return formatDiets(dietDescription);
  }
};

// src/application/use-cases/payment-session/errors/find-payment-session-by-session-id-exception.ts
var FindPaymentSessionBySessionIdException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar encontrar uma sess\xE3o de pagamento: ${err}.`);
    this.name = "FindPaymentSessionBySessionIdException";
  }
};

// src/application/use-cases/payment-session/find-payment-session-by-session-id.ts
var FindPaymentSessionBySessionIdUseCase = class {
  constructor(paymentSessionRepository) {
    this.paymentSessionRepository = paymentSessionRepository;
  }
  async execute(sessionId) {
    try {
      if (!sessionId) return null;
      return await this.paymentSessionRepository.findBySessionId(sessionId);
    } catch (err) {
      throw new FindPaymentSessionBySessionIdException(err);
    }
  }
};

// src/lib/prisma/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "dev" ? [] : []
});

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

// src/application/factory/diet/make-create-diet-factory.ts
function makeCreateDiet() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(
    paymentSessionRepository
  );
  const createDietUseCase = new CreateDietUseCase(findPaymentSessionBySessionIdUseCase);
  return createDietUseCase;
}

// src/infra/http/rest/controller/create-diet-controller.ts
var CreateDietController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const makeCreateDietUseCase = makeCreateDiet();
        const { calories, sessionId, excludedFoods } = request.body;
        const { description } = await makeCreateDietUseCase.execute({
          calories,
          sessionId,
          excludedFoods
        });
        return reply.status(201).send({ diet: description });
      } catch (err) {
        return reply.status(err instanceof CreateDietException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/diet.routes.ts
var createDietController = new CreateDietController();
async function createDietRoutes(app2) {
  app2.post("/", createDietController.create);
}

// src/application/factory/find-session-payment-by-session-id/make-find-session-payment-by-session-id-.ts
function makefindPaymentSessionBySessionId() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(
    paymentSessionRepository
  );
  return findPaymentSessionBySessionIdUseCase;
}

// src/infra/http/rest/controller/find-payment-session-by-session-id.ts
var FindPaymentSessionBySessionIdController = class {
  constructor() {
    this.find = async (request, reply) => {
      try {
        const { sessionId } = request.body;
        const makefindPaymentSessionBySessionIdUseCase = makefindPaymentSessionBySessionId();
        const session = await makefindPaymentSessionBySessionIdUseCase.execute(sessionId);
        return reply.status(201).send({ session });
      } catch (err) {
        return reply.status(err instanceof FindPaymentSessionBySessionIdException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/find.session.payment.by.session.id.routes.ts
var findPaymentSessionBySessionIdController = new FindPaymentSessionBySessionIdController();
async function findPaymentSessionBySessionId(app2) {
  app2.post("/", findPaymentSessionBySessionIdController.find);
}

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

// src/infra/http/rest/routes/webhook.pix.routes.ts
var webhookPixController = new WebhookPixController();
async function webhookPixRoutes(app2) {
  app2.post("/", webhookPixController.create);
}

// src/application/use-cases/webhook/errors/secret-exception.ts
var SecretException = class extends UseCaseError {
  constructor(err) {
    super(`Erro na chave secreta: ${err}.`);
    this.name = "SecretException";
  }
};

// src/application/use-cases/webhook/errors/webhook-exception.ts
var WebhookException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao se comunicar com o webhook: ${err}.`);
    this.name = "WebhookException";
  }
};

// src/application/use-cases/webhook/webhook-use-case.ts
var WebHookUseCase = class {
  constructor(createPaymentSessionUseCase, updatePaymentSessionUseCase) {
    this.createPaymentSessionUseCase = createPaymentSessionUseCase;
    this.updatePaymentSessionUseCase = updatePaymentSessionUseCase;
  }
  async execute({ body, signature, event }) {
    try {
      const secret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
      if (secret) {
        try {
          event = stripe.webhooks.constructEvent(body, signature, secret);
        } catch (err) {
          throw new SecretException(err);
        }
      }
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (session.payment_status === "paid") {
            const session2 = event.data.object;
            const sessionInput = PaymentSession.create({
              email: session2.customer_details?.email,
              isPaid: true,
              sessionId: session2.id,
              paymentType: "CARD" /* CARD */
            });
            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }
          if (event.data.object.payment_status === "unpaid" && event.data.object.payment_intent) {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              event.data.object.payment_intent.toString()
            );
            if (paymentIntent) {
              const sessionInput = PaymentSession.create({
                email: session.customer_details?.email,
                isPaid: false,
                sessionId: session.id,
                paymentType: "BOLETO" /* BOLETO */
              });
              return await this.createPaymentSessionUseCase.execute(sessionInput);
            }
          }
          break;
        }
        case "checkout.session.async_payment_succeeded":
          if (event.data.object.payment_status === "paid") {
            const session = event.data.object;
            const sessionInput = PaymentSession.create({
              email: session.customer_details?.email,
              isPaid: true,
              sessionId: session.id,
              paymentType: "BOLETO" /* BOLETO */
            });
            return await this.updatePaymentSessionUseCase.execute(sessionInput);
          }
          break;
        case "checkout.session.async_payment_failed":
          if (event.data.object.payment_status === "unpaid") {
            const session = event.data.object;
          }
          break;
        default:
      }
    } catch (err) {
      throw new WebhookException(err);
    }
  }
};

// src/application/factory/webhook/make-webhook-factory.ts
function makeWebhook() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const createPaymentSession = new CreatePaymentSessionUseCase(paymentSessionRepository);
  const updatePaymentSession = new UpdatePaymentSessionUseCase(paymentSessionRepository);
  const webhookUseCase = new WebHookUseCase(createPaymentSession, updatePaymentSession);
  return webhookUseCase;
}

// src/infra/http/rest/controller/webhook-controller.ts
var WebhookController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        let event = request.body;
        const body = request.rawBody;
        const signature = request.headers["stripe-signature"];
        const webhookUseCase = makeWebhook();
        await webhookUseCase.execute({ event, body, signature });
        return reply.status(200).send({ result: event, ok: true });
      } catch (err) {
        console.error("Erro no webhook:", err);
        return reply.status(500).send({
          message: `Erro no webhook: ${err.message}`,
          ok: false
        });
      }
    };
  }
};

// src/infra/http/rest/routes/weebhook.routes.ts
var webhookController = new WebhookController();
async function webhookRoutes(app2) {
  app2.post("/", { config: { rawBody: true } }, webhookController.create);
}

// src/infra/http/rest/routes/index.routes.ts
async function appRoutes() {
  app.register(createCaloriesRoutes, { prefix: "/calculate-calories" });
  app.register(createDietRoutes, { prefix: "/api/gemini" });
  app.register(createCheckoutRoutes, { prefix: "/checkout-card" });
  app.register(createCheckoutPixRoutes, { prefix: "/checkout-pix" });
  app.register(webhookRoutes, { prefix: "/webhooks/stripe" });
  app.register(webhookPixRoutes, { prefix: "/webhooks/mercadopago" });
  app.register(findPaymentSessionBySessionId, {
    prefix: "/find-payment-session"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
