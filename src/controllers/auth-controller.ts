import { Request, Response, NextFunction } from "express";
import prisma from "../configs/prisma";
import createError from "../utils/createError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


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
      where: { email:email },
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password} = req.body;
    //check if user exists
    const user = await prisma.user.findFirst({
      where: { email:email },
    });
    if (!user) {
      return createError(400, "Invalid email or password");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    console.log("isMatch Check:",isMatch)
    if (!isMatch) {
      return createError(400, "Email or password is invalid");
    }
    //create token
    const payload = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    console.log("payload check:",payload);
    //have to use type assertion for jwt to prevent error
    const secret = process.env.SECRET_KEY as string;
    if (!secret) {
      return createError(500, "SECRET_KEY is not defined in environment variables");
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: "1d",
    });
    console.log("token check:",token);
    res.status(201).json({
        message: "Login successful",
        payload:payload,
        token:token,
      });
  } catch (error) {
    console.log("Login error log:",error);
    next(error);
  }
};

export const getCurrentUser = async (
    req: Request,  // ใช้ Request มาตรฐาน
    res: Response,
    next: NextFunction
  ) => {
    try {
      // ตรวจสอบว่ามี user หรือไม่
      if (!req.user) {
        return createError(401, "User not authenticated") ;
      }
      
      const { email } = req.user;
      console.log("email Check", email);
      
      const user = await prisma.user.findFirst({
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
    } catch (error) {
      console.log("currentUser error log:", error);
      next(error);
    }
  };