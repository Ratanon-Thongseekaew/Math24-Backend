import pirsma from "../configs/prisma";
import { Request, Response, NextFunction } from "express";
import createError from "../utils/createError";
import prisma from "../configs/prisma";
import { ValidationResult } from "../types/game";

// Generate number logic
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

//submit answer logic
export const submitSolution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { gameId, expression } = req.body;
    if (!userId) {
      return createError(401, "Unauthorized");
    }
    if (!gameId || !expression) {
      return createError(400, "Game ID and expression are required");
    }
    //get Game data
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      return createError(404, "Game not found");
    }
    if (game.userId !== userId) {
      return createError(
        403,
        "You are not authorized to submit solution for this game"
      );
    }
    // string -> array
    const numbers = JSON.parse(game.numbers) as number[];

    // check answer
    const { isValid, result } = validateExpression(expression, numbers);

    const solution = await prisma.solution.create({
      data: {
        gameId: gameId,
        expression: expression,
        isCorrect: isValid && Math.abs(result - 24) < 0.0001,
      },
    });
    if (solution.isCorrect) {
      await prisma.game.update({
        where: { id: gameId },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
      await prisma.history.create({
        data: {
          userId: userId,
          numbers: game.numbers,
          expression: expression,
          createdAt: new Date(),
        },
      });
      res.status(200).json({
        success: true,
        isCorrect: true,
        message: "Correct!",
      });
    } else {
      res.status(200).json({
        success: true,
        isCorrect: false,
        message: "Incorrect!",
      });
    }
  } catch (error) {
    next(error);
  }
};
function validateExpression(
  expression: string,
  numbers: number[]
): ValidationResult {
  try {
    // validate expression
    const usedNumbers = extractNumbersFromExpression(expression);
    // ตรวจสอบว่าใช้ตัวเลขครบทุกตัวและแต่ละตัวใช้แค่ครั้งเดียว
    if (!areArraysEqual(numbers.sort(), usedNumbers.sort())) {
      return { isValid: false, result: 0 };
    }
    const sanitizedExpression = sanitizeExpression(expression);
    const result = evaluateExpression(sanitizedExpression);

    return {
      isValid: true,
      result,
      usedNumbers,
    };
  } catch (error) {
    return { isValid: false, result: 0 };
  }
}
// seperate numbers from expression
function extractNumbersFromExpression(expression: string): number[] {
  const numMatches = expression.match(/\d+/g);
  return numMatches ? numMatches.map(Number) : [];
}
//compare array
function areArraysEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length){
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
//clear Expression
function sanitizeExpression(expression: string): string {
  // อนุญาตเฉพาะตัวเลข และเครื่องหมาย +, -, *, /, (, ) เท่านั้น
  return expression.replace(/[^0-9+\-*/().]/g, '');
}

// ฟังก์ชันคำนวณนิพจน์
function evaluateExpression(expression: string): number {
  // ในโค้ดจริง ควรใช้ไลบรารีอื่นแทน eval เช่น mathjs
  // เพื่อความปลอดภัย
  try {
    // แนะนำให้ใช้ mathjs แทน
    return eval(expression);
  } catch (error) {
    throw new Error('Invalid expression');
  }
}