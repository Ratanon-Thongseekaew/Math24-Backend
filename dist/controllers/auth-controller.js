"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../configs/prisma"));
const createError_1 = __importDefault(require("../utils/createError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = async (req, res, next) => {
    try {
        //req.body
        const { firstname, lastname, email, password, confirmPassword } = req.body;
        //validation
        //check if user exists
        const checkEmail = await prisma_1.default.user.findFirst({
            where: { email: email },
        });
        console.log(checkEmail);
        if (checkEmail) {
            return (0, createError_1.default)(400, "Email already exists");
        }
        //encrypt password
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashPassword = bcryptjs_1.default.hashSync(password, salt);
        console.log("hashPassword check:", hashPassword);
        //create user & insert into db
        const user = await prisma_1.default.user.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashPassword,
            },
        });
        res.status(201).json({
            message: "Register Success",
            user: user,
        });
    }
    catch (error) {
        console.log("register error log:", error);
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //check if user exists
        const user = await prisma_1.default.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            return (0, createError_1.default)(400, "Invalid email or password");
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.password);
        console.log("isMatch Check:", isMatch);
        if (!isMatch) {
            return (0, createError_1.default)(400, "Email or password is invalid");
        }
        //create token
        const payload = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
        console.log("payload check:", payload);
        //have to use type assertion for jwt to prevent error
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            return next((0, createError_1.default)(500, "SECRET_KEY is not defined in environment variables"));
        }
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: "1d",
        });
        console.log("token check:", token);
        res.status(201).json({
            message: "Login successful",
            token: token,
        });
    }
    catch (error) {
        console.log("Login error log:", error);
        next(error);
    }
};
exports.login = login;
const getCurrentUser = async (req, // ใช้ Request มาตรฐาน
res, next) => {
    try {
        // ตรวจสอบว่ามี user หรือไม่
        if (!req.user) {
            return next((0, createError_1.default)(401, "User not authenticated"));
        }
        const { email } = req.user;
        console.log("email Check", email);
        const user = await prisma_1.default.user.findFirst({
            where: { email: email },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
            }
        });
        console.log("user Check", user);
        res.status(201).json({
            message: "Get Me Success",
            user: user,
        });
    }
    catch (error) {
        console.log("currentUser error log:", error);
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
