import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import createError from "../utils/createError";

export const registerUser = z
  .object({
    email: z.string().email(),
    firstname: z
      .string()
      .min(3, "firstname must contain at least 3 characters"),
    lastname: z.string().min(3, "lastname must contain at least 3 characters"),
    password: z.string().min(6, "password must contains at least 6 character."),
    confirmPassword: z
      .string()
      .min(6, "password must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password Is NOT Matched",
    path: ["confirmPassword"],
  });
//ทำให้เราสามารถใช้ type นี้ในส่วนอื่นๆ ของโค้ดได้ เช่น ใช้กับ function parameters หรือ React components
//สร้าง type ของข้อมูลที่ถูกต้องจากการตรวจสอบด้วย zod
type RegisterUserInput = z.infer<typeof registerUser>;

export const loginUser = z.object({
  email: z.string().email("Invalid email or password"),
  password: z.string().min(6, "Invalid email or password"),
});

type LoginUserInput = z.infer<typeof loginUser>;

export const validateWithZod =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("hello, validateWithZod");
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errMsg = error.errors.map((item) => item.message).join(", ");
        console.log("check errMsg:", errMsg);
        //  error จะถูกส่งไปยัง middleware
        next(createError(400, `Validation Error: ${errMsg}`));
      } else {
        next(createError(500, "Internal Server Error"));
      }
    }
  };
