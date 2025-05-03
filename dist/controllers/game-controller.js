"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const result = generateRandomNumber(1, 9);
console.log("result check:", result);
