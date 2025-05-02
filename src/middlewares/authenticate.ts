import { NextFunction, Request, Response } from "express";
import createError from "../utils/createError";
import jwt from "jsonwebtoken";
import {  UserPayload } from "../types/auth";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //code
    //รับ headers จาก CLIENT
    const authorization = req.headers.authorization;
    console.log("authorization check:", authorization);
    if (!authorization) {
      return next(createError(400, "Bad Request"));
    }
    const token = authorization.split(" ")[1];
    //verify token
    const secret = process.env.SECRET_KEY as string;
    if (!secret) {
      return next(
        createError(500, "SECRET_KEY is not defined in environment variables")
      );
    }
    jwt.verify(token, secret, (err, decode) => {
      console.log("err check:", err);
      console.log("decode check:", decode);
      if (err) {
        return next(createError(401, "Unauthorized"));
      }
      req.user = decode as UserPayload;
      next();
    });
  } catch (error) {
    console.log("authenticate error log:", error);
    next(error);
  }
};
