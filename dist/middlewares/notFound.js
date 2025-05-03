"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const error = new Error(`Resource is not found ${req.originalUrl}`);
    error.status = 404;
    next(error);
};
exports.default = notFound;
