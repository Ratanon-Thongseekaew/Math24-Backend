import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("ErrorHandler Log:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "something went wrong !",
  });
};

export default errorHandler;
