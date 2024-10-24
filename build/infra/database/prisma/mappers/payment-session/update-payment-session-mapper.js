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

// src/infra/database/prisma/mappers/payment-session/update-payment-session-mapper.ts
var update_payment_session_mapper_exports = {};
__export(update_payment_session_mapper_exports, {
  UpdatePaymentSessionMapper: () => UpdatePaymentSessionMapper
});
module.exports = __toCommonJS(update_payment_session_mapper_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdatePaymentSessionMapper
});
