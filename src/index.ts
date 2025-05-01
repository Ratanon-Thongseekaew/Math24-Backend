import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth-routes"
dotenv.config();
const app = express();

app.use("/api",authRouter)

const PORT = process.env.PORT || 7777;


app.listen(PORT,()=>{
    console.log(`This server is runnning on Port ${PORT}`)
});
