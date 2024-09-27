import { TokenExpiredError } from "jsonwebtoken";

const getToken = (request) =>{
    //extrair o token
    const authHeader = request.headers.authorization;
    //baerer toker
    const token = authHeader.splint(".")[1];

    return TokenExpiredError; 
} 
