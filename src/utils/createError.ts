interface CustomError extends Error {
  statusCode?: number;
}

const createError = (code:number,message:string):never=>{
    const error: CustomError = new Error(message);
    error.statusCode = code;
    throw error;
}
// used never type as this function always throws an error
export default createError;
