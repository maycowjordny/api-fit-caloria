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

// src/infra/http/rest/routes/checkout.pix.routes.ts
var checkout_pix_routes_exports = {};
__export(checkout_pix_routes_exports, {
  createCheckoutPixRoutes: () => createCheckoutPixRoutes
});
module.exports = __toCommonJS(checkout_pix_routes_exports);

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

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
            unit_price: 9.99
          }
        ],
        payment_methods: {
          excluded_payment_types: [
            { id: "credit_card" },
            { id: "debit_card" },
            { id: "ticket" },
            { id: "atm" },
            { id: "prepaid_card" }
          ]
        },
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
        reply.status(200).send({ id: session.external_reference, url: session.init_point });
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
async function createCheckoutPixRoutes(app) {
  app.post("/", createCheckoutPixController.create);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCheckoutPixRoutes
});
