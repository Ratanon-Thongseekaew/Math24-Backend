import { Express, Router } from "express";
import {  getCurrentUser, login, register, test } from "../controllers/auth-controller";
import { loginUser, registerUser, validateWithZod } from "../middlewares/validators";
import { authenticate } from "../middlewares/authenticate";
const authRouter = Router();

authRouter.get("/test",test)
authRouter.post("/register",validateWithZod(registerUser),register)
authRouter.post("/login",validateWithZod(loginUser),login)
authRouter.get("/me",authenticate,getCurrentUser)
// authRouter.post("/login")
// authRouter.get("/me")



export default authRouter