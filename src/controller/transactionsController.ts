import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import z, { date } from "zod";

class TransactionsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().optional(),
            amount: z.number().positive(),
            category: z.enum(["food", "transport", "leisure", "health", "salary"]),
            type: z.enum(["income", "expense"]),
            date: z.coerce.date().default(new Date())
        })

        const {name, description, amount, category, type, date } = bodySchema.parse(request.body);

        const transaction = await prisma.transaction.create({
            data: {
                name,
                description,
                amount,
                category,
                type,
                date,
                userId: request.user.id
            }
        })

        return response.status(201).json({
            message: "Transaction created sucessfulluy",
            transaction
        })
    }

    async index(request: Request, response: Response) {
        const transactions = await prisma.transaction.findMany({
            where: { userId: request.user.id },
            select: { id: true, name: true, description: true, amount: true, category: true, type: true, date: true }
        })

        if(transactions.length === 0) {
            return response.json({
                message: "No transactions found"
            })
        }

        return response.status(200).json({
            transactions
        })
    }

    async update(request: Request, response: Response) {
         const paramsSchema = z.object({
            id: z.uuid()
        })
        
        const bodySchema = z.object({
            name: z.string().min(3).optional(),
            description: z.string().optional(),
            amount: z.number().positive().optional(),
            category: z.enum(["food", "transport", "leisure", "health", "salary"]).optional(),
            type: z.enum(["income", "expense"]).optional(),
            date: z.coerce.date().optional()
        })


        const { id } = paramsSchema.parse(request.params);
        const { name, description, amount, category, type, date } = bodySchema.parse(request.body);

        const transaction = await prisma.transaction.findUnique({
            where: { id }
        })

        if(!transaction) {
            return response.status(400).json({
                message: "Transaction not found"
            })
        }

        await prisma.transaction.update({
            where: { id },
            data: { name, description, amount, category, type, date }
        })

        return response.status(200).json({
            message: "Transaction updated successfully"
        })
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid()
        })

        const {id} = paramsSchema.parse(request.params);

        await prisma.transaction.delete({
            where: {id}
        })  

        return response.status(200).json({
            message: "Transaction deleted successfully"
        })
    }
}
export { TransactionsController };