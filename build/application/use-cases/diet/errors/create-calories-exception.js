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

// src/application/use-cases/diet/errors/create-calories-exception.ts
var create_calories_exception_exports = {};
__export(create_calories_exception_exports, {
  CreateCaloriesException: () => CreateCaloriesException
});
module.exports = __toCommonJS(create_calories_exception_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCaloriesException
});