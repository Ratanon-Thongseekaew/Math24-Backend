import { Request,Response,NextFunction } from "express";

export const test= async(request:Request, response:Response,next:NextFunction)=>{
try {
    response.send(["Hello, Typescript"])
} catch (error) {
    next(error)
}
}

export const register = async(request:Request, response:Response,next:NextFunction)=>{
    try {
        
    } catch (error) {
        
    }
}