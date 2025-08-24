import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body);


        const userAlreadyExists = await prisma.user.findUnique({
            where: { email }
        })

        if(userAlreadyExists) {
            throw new AppError("User already exists")
        }

        const hashedPassword = await hash(password, 8);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })

        const {password: _, ...userWithoutPassowrd} = user

        return response.status(201).json(userWithoutPassowrd);
    }


}
export { UsersController };