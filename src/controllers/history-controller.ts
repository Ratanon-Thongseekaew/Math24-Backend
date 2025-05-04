import { Request, Response, NextFunction } from "express";
import createError from "../utils/createError";
import prisma from "../configs/prisma";

//get all history
export const getAllHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 5 } = req.query;
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return createError(400, "Invalid type for page or limit");
    }
    if (!userId) {
      return createError(401, "Unauthorized");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const history = await prisma.history.findMany({
      where: {
        userId: userId,
      },
      select: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        id: true,
        numbers: true,
        expression: true,
        createdAt: true,
      },
      skip: skip,
      take: Number(limit),
    });
    res.status(201).json({
      message: "Get Histories Success",
      history: history,
    });
  } catch (error) {
    console.log("history error check:", error);
    next(error);
  }
};

//get all history by ID

export const getHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return createError(401, "Unauthorized");
    }
    if (isNaN(Number(id))) {
      return createError(400, "Invalid order ID");
    }
    const history = await prisma.history.findFirst({
        where:{
            id:Number(id),
            userId:userId
        },
        select: {
            user: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
            id: true,
            numbers: true,
            expression: true,
            createdAt: true,
          },
    })
    res.status(201).json({
        message: "Get History by ID Success",
        history: history,
      });
  } catch (error) {
    console.log("history by ID error check:", error);
    next(error);
  }
};
