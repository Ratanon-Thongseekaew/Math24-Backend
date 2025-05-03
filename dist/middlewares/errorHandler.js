"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.log("ErrorHandler Log:", err);
    res.status(err.statusCode || 500).json({
        message: err.message || "something went wrong !",
    });
};
exports.default = errorHandler;
