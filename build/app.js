"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./core/config");
const server_1 = require("./core/server");
const server = new server_1.Server({ port: config_1.env.PORT, apiPrefix: "/api/v2" });
server.start();
