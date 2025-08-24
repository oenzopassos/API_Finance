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

        if (userAlreadyExists) {
            throw new AppError("User already exists")
        }

        const hashedPassword = await hash(password, 8);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })

        const { password: _, ...userWithoutPassowrd } = user

        return response.status(201).json(userWithoutPassowrd);
    }


    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3).optional(),
            password: z.string().min(6).optional(),
            old_password: z.string().min(6).optional()
        })

        const { name, password, old_password } = bodySchema.parse(request.body);

        const user = await prisma.user.findUnique({
            where: { id: request.user.id }
        })

        if (!user) {
            throw new AppError("User not found", 404)
        }

        if (password && !old_password) {
            throw new AppError("You need to inform the old password to set a new password")
        }
        if(password && old_password) {
            const checkOldPassword = await hash(old_password, user.password);

            if(!checkOldPassword) {
                throw new AppError("Old password does not match")
            }
        }

        const hashedPassword = password ? await hash(password, 8) : user.password;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name ?? user.name,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = updatedUser;

        return response.status(200).json(userWithoutPassword);
    }


}
export { UsersController };