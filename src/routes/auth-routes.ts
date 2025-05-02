import { Express, Router } from "express";
import {  register, test } from "../controllers/auth-controller";
import { registerUser, validateWithZod } from "../middlewares/validators";
const authRouter = Router();

authRouter.get("/test",test)
authRouter.post("/register",validateWithZod(registerUser),register)
// authRouter.post("/login")
// authRouter.get("/me")



export default authRouter