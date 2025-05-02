import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import notFound from "./middlewares/notFound"
import authRouter from "./routes/auth-routes"
import errorHandler from "./middlewares/errorHandler"
dotenv.config();
const app = express();

//middleware
app.use(express.json()) // reading json
app.use(cors())
app.use(morgan("dev"))
//routing
app.use("/api",authRouter)




//import error
app.use(notFound)
app.use(errorHandler)

//server
const PORT = process.env.PORT || 7777;
app.listen(PORT,()=>{
    console.log(`This server is runnning on Port ${PORT}`)
});
