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

// src/application/use-cases/checkout/pix/create-pix-checkout-use-case.ts
var create_pix_checkout_use_case_exports = {};
__export(create_pix_checkout_use_case_exports, {
  CreateCheckoutPixUseCase: () => CreateCheckoutPixUseCase
});
module.exports = __toCommonJS(create_pix_checkout_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCheckoutPixUseCase
});
