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

// src/application/use-cases/diet/create-diet-use-case.ts
var create_diet_use_case_exports = {};
__export(create_diet_use_case_exports, {
  CreateDietUseCase: () => CreateDietUseCase
});
module.exports = __toCommonJS(create_diet_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDietUseCase
});
