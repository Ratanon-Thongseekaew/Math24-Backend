import { Request, Response, NextFunction } from "express";
import prisma from "../configs/prisma";
import createError from "../utils/createError";
import bcrypt from "bcryptjs";

export const test = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(["Hello, Typescript"]);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //req.body
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    //validation
    //check if user exists
    const checkEmail = await prisma.user.findFirst({
      where: { email },
    });
    console.log(checkEmail);
    if (checkEmail) {
      return createError(400, "Email already exists");
    }
    //encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    console.log("hashPassword check:", hashPassword);
    //create user & insert into db
    const user = await prisma.user.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
      },
    });
    res.status(201).json({
      message: "Register Success",
      user:user,
    });
  } catch (error) {
    console.log("register error log:",error);
    next(error);
  }
};
