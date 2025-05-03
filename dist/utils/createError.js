"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createError = (code, message) => {
    const error = new Error(message);
    error.statusCode = code;
    throw error;
};
// used never type as this function always throws an error
exports.default = createError;
