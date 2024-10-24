"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/application/factory/diet/make-create-diet-factory.ts
var make_create_diet_factory_exports = {};
__export(make_create_diet_factory_exports, {
  makeCreateDiet: () => makeCreateDiet
});
module.exports = __toCommonJS(make_create_diet_factory_exports);

// src/utils/format-diets.ts
function formatDiets(text) {
  let menus = text.split(/\*\*Card[aá]pio \d+:\*\*/).toString();
  return menus;
}

// src/application/use-cases/diet/create-diet-use-case.ts
var import_generative_ai = require("@google/generative-ai");

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCreateDiet
});
