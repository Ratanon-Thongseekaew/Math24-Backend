"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const createError_1 = __importDefault(require("../utils/createError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    try {
        //code
        //รับ headers จาก CLIENT
        const authorization = req.headers.authorization;
        console.log("authorization check:", authorization);
        if (!authorization) {
            return next((0, createError_1.default)(400, "Bad Request"));
        }
        const token = authorization.split(" ")[1];
        //verify token
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            return next((0, createError_1.default)(500, "SECRET_KEY is not defined in environment variables"));
        }
        jsonwebtoken_1.default.verify(token, secret, (err, decode) => {
            console.log("err check:", err);
            console.log("decode check:", decode);
            if (err) {
                return next((0, createError_1.default)(401, "Unauthorized"));
            }
            req.user = decode;
            next();
        });
    }
    catch (error) {
        console.log("authenticate error log:", error);
        next(error);
    }
};
exports.authenticate = authenticate;
