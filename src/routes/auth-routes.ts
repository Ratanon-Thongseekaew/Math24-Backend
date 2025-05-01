import { Express, Router } from "express";
import {  register, test } from "../controllers/auth-controller";
const authRouter = Router();

authRouter.get("/test",test)
authRouter.post("register",register)
// authRouter.post("/login")
// authRouter.get("/me")



export default authRouter