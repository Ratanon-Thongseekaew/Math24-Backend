import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const notFound = (req: Request, res: Response, next: NextFunction):void => {
  const error: CustomError = new Error(
    `Resource is not found ${req.originalUrl}`
  );
  error.status = 404;
  next(error);
};

export default notFound;
