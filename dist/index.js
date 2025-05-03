"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json()); // reading json
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
//routing
app.use("/api", auth_routes_1.default);
//import error
app.use(notFound_1.default);
app.use(errorHandler_1.default);
//server
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`This server is runnning on Port ${PORT}`);
});
