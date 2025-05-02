import { Request } from "express";

export interface UserPayload {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}
declare global {
    namespace Express {
      // ขยาย Express Request interface
      interface Request {
        user?: UserPayload;
      }
    }
  }
