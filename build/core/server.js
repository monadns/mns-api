"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const httpcodes_1 = require("./httpcodes");
const ejs_1 = __importDefault(require("ejs"));
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        const { port } = options;
        this.port = port;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.static('dist'));
            this.app.set("trust proxy", true);
            this.app.engine('html', ejs_1.default.renderFile);
            this.app.set('view engine', 'html');
            this.app.set('views', './');
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use("/", (req, res) => {
                res.render("index", {});
            });
            this.app.use((req, res, next) => {
                res.status(httpcodes_1.HttpCode.NOT_FOUND).send({ errors: [{ message: "Not found" }] });
            });
            this.app.use((error, req, res, next) => {
                console.log(error);
                res.status(httpcodes_1.HttpCode.INTERNAL_SERVER_ERROR).send({ errors: [{ message: "Something went wrong" }] });
            });
            this.app.listen(this.port, () => {
                console.log(`Listening port: ${this.port}`);
            });
        });
    }
}
exports.Server = Server;
