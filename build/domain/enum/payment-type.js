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

// src/domain/enum/payment-type.ts
var payment_type_exports = {};
__export(payment_type_exports, {
  PaymentTypeEnum: () => PaymentTypeEnum
});
module.exports = __toCommonJS(payment_type_exports);
var PaymentTypeEnum = /* @__PURE__ */ ((PaymentTypeEnum2) => {
  PaymentTypeEnum2["CARD"] = "CARD";
  PaymentTypeEnum2["BOLETO"] = "BOLETO";
  PaymentTypeEnum2["PIX"] = "PIX";
  return PaymentTypeEnum2;
})(PaymentTypeEnum || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PaymentTypeEnum
});
