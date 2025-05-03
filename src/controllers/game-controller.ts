import pirsma from "../configs/prisma";
import { Request, Response, NextFunction } from "express";
import createError from "../utils/createError";
import prisma from "../configs/prisma";

// Generate number parts
const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 9) + 1; // *9 to limit to 0-8 and +1 to get 1-9 with mathh.floor
};
// check number array for the result of 24
const canMake24 = (numbers: number[]): boolean => {
  const checkExpression = (nums: number[], target: number = 24): boolean => {
    if (nums.length === 1) {
      return Math.abs(nums[0] - target) < 0.001; // abs = หาความต่างของสองค่านี้แบบไม่สนเครื่องหมายบวกลบ
    }
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const a = nums[i];
        const b = nums[j];
        const remainingNums = nums.filter(
          (_, index) => index !== i && index !== j
        ); //_, เป็นการละ parameter แรก

        // Try all operations
        if (checkExpression([...remainingNums, a + b], target)) return true;
        if (checkExpression([...remainingNums, a - b], target)) return true;
        if (checkExpression([...remainingNums, b - a], target)) return true;
        if (checkExpression([...remainingNums, a * b], target)) return true;
        if (b !== 0 && checkExpression([...remainingNums, a / b], target))
          return true;
        if (a !== 0 && checkExpression([...remainingNums, b / a], target))
          return true;
      }
    }
    return false;
  };

  return checkExpression(numbers);
};

//generate 4 random number that can do 24

const findValidNumbers = (): number[] => {
  let numbers: number[];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    numbers = [];
    for (let i = 0; i < 4; i++) {
      numbers.push(generateRandomNumber());
    }
    attempts++;
  } while (!canMake24(numbers) && attempts < maxAttempts);
  if (attempts >= maxAttempts) {
    // alternative set of data if attempt is over 100 and no number found
    const knownSets = [
      [1, 3, 4, 6],
      [1, 3, 8, 8],
      [1, 4, 6, 8],
      [2, 5, 8, 9],
      [3, 3, 8, 8],
      [3, 5, 7, 9],
      [2, 3, 3, 4],
      [4, 6, 7, 9],
      [1, 4, 7, 8],
      [1, 5, 8, 8],
    ];
    return knownSets[Math.floor(Math.random() * knownSets.length)];
  }
  return numbers;
};

export const generateNumbers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return createError(401, "Unauthorized");
    }
    const numbers = findValidNumbers();
    const game = await prisma.game.create({
      data: {
        userId: userId,
        numbers: JSON.stringify(numbers),
        isCompleted: false,
      },
    });
    console.log("Generate Number for game Check:", game);
    res.status(200).json({
      success: true,
      gameId: game.id,
      numbers,
    });
  } catch (error) {
    console.error("Error generating numbers:", error);
    next(error);
  }
};
