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

// src/application/use-cases/diet/errors/diet-description-failed-exception.ts
var diet_description_failed_exception_exports = {};
__export(diet_description_failed_exception_exports, {
  DietDescriptionFailedException: () => DietDescriptionFailedException
});
module.exports = __toCommonJS(diet_description_failed_exception_exports);

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/diet/errors/diet-description-failed-exception.ts
var DietDescriptionFailedException = class extends UseCaseError {
  constructor() {
    super("Erro ao gerar dieta");
    this.name = "DietDescriptionFailedException";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DietDescriptionFailedException
});
