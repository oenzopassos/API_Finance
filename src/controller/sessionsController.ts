import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

class SessionsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6),
        })

        const { email, password } = bodySchema.parse(request.body);

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new AppError("Email or password incorrect", 401);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        const { password: hashedPassword, ...userWithoutPassword } = user;
        return response.status(200).json({ token, user: userWithoutPassword });
    }
}
export { SessionsController };