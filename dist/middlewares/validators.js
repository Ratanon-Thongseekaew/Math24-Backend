"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithZod = exports.loginUser = exports.registerUser = void 0;
const zod_1 = require("zod");
const createError_1 = __importDefault(require("../utils/createError"));
exports.registerUser = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    firstname: zod_1.z
        .string()
        .min(3, "firstname must contain at least 3 characters"),
    lastname: zod_1.z.string().min(3, "lastname must contain at least 3 characters"),
    password: zod_1.z.string().min(6, "password must contains at least 6 character."),
    confirmPassword: zod_1.z
        .string()
        .min(6, "password must contain at least 6 characters"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Password Is NOT Matched",
    path: ["confirmPassword"],
});
exports.loginUser = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email or password"),
    password: zod_1.z.string().min(6, "Invalid email or password"),
});
const validateWithZod = (schema) => (req, res, next) => {
    try {
        console.log("hello, validateWithZod");
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errMsg = error.errors.map((item) => item.message).join(", ");
            console.log("check errMsg:", errMsg);
            //  error จะถูกส่งไปยัง middleware
            next((0, createError_1.default)(400, `Validation Error: ${errMsg}`));
        }
        else {
            next((0, createError_1.default)(500, "Internal Server Error"));
        }
    }
};
exports.validateWithZod = validateWithZod;
