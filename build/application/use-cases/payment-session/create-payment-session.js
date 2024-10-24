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

// src/application/use-cases/payment-session/create-payment-session.ts
var create_payment_session_exports = {};
__export(create_payment_session_exports, {
  CreatePaymentSessionUseCase: () => CreatePaymentSessionUseCase
});
module.exports = __toCommonJS(create_payment_session_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePaymentSessionUseCase
});
