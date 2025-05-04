import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import morgan from "morgan"
import notFound from "./middlewares/notFound"
import authRouter from "./routes/auth-routes"
import gameRouter from "./routes/game-routes"
import historyRouter from "./routes/history-routes"
import errorHandler from "./middlewares/errorHandler"
const app = express();

//middleware
app.use(express.json()) // reading json
app.use(cors())
app.use(morgan("dev"))
//routing
app.use("/api",authRouter)
app.use("/api/games",gameRouter)
app.use("/api/history",historyRouter)


//import error
app.use(notFound)
app.use(errorHandler)

//server
const PORT = process.env.PORT || 7777;
app.listen(PORT,()=>{
    console.log(`This server is runnning on Port ${PORT}`)
});
