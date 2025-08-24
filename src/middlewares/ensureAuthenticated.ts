import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";



interface TokenPayload {
    sub: string;
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization;
     if(!authHeader) {
        throw new Error("JWT token not found");
     }
        const [, token] = authHeader.split(" ");

        const {sub: userId} = verify(token, authConfig.jwt.secret) as TokenPayload;

        request.user = {
            id: userId
        }

        return next();
    } catch (error) {
        throw new AppError("Invalid JWT token", 401);
    }
}

export { ensureAuthenticated };