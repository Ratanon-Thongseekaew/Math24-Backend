import { Request } from "express";

export interface UserPayload {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

// ขยาย Express Request interface ด้วย declare global
declare global {
    namespace Express {
      // ขยาย Express Request interface
      interface Request {
        user?: UserPayload;
      }
    }
  }
