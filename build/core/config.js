"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.env = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    NODE_ENV: (0, env_var_1.get)('NODE_ENV').default('development').asString()
};
