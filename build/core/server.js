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
exports.getTokenId = exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const httpcodes_1 = require("./httpcodes");
const ejs_1 = __importDefault(require("ejs"));
const ethers_1 = require("ethers");
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        const { port } = options;
        this.port = port;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.locals.ogImageUrl = null;
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.set("trust proxy", true);
            this.app.engine('html', ejs_1.default.renderFile);
            this.app.set('view engine', 'html');
            this.app.set('views', 'dist');
            this.app.use("/", (req, res, next) => {
                if (req.url != "/")
                    return next();
                res.render("index", {});
            });
            this.app.use("/:name.mon", (req, res, next) => {
                var _a;
                console.log(req.params.name);
                console.log((0, exports.getTokenId)(req.params.name));
                res.render("index", { ogImageUrl: (_a = process.env.OG_IMAGE_URL) === null || _a === void 0 ? void 0 : _a.replace("{tokenId}", (0, exports.getTokenId)(req.params.name)) });
            });
            this.app.use(express_1.default.static('dist'));
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
const getTokenId = (label) => {
    const labelHash = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(label));
    const tokenId = ethers_1.ethers.toBigInt(labelHash).toString();
    return tokenId;
};
exports.getTokenId = getTokenId;
