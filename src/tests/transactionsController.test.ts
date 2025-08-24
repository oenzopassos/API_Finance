import { app } from "@/app";
import { prisma } from "@/database/prisma";
import request from "supertest";
import { date } from "zod";

describe("TransactionsController", () => {
    let userId: string;
    let token: string;

    beforeAll(async () => {
        const createUser = await request(app).post("/users").send({
            name: "Teste User",
            email: "testeuser@example.com",
            password: "123456",
        });
        userId = createUser.body.id;

        const login = await request(app).post("/sessions").send({
            email: "testeuser@example.com",
            password: "123456"
        });
        token = login.body.token;
    })

    afterAll(async () => {
        await prisma.transaction.deleteMany({ where: { userId: userId } })
        await prisma.user.delete({ where: { id: userId } })
    })


    it("Should create a new transaction", async () => {
        const response = await request(app)
            .post("/transactions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Salary",
                description: "Monthly salary",
                amount: 5000,
                category: "salary",
                type: "income",
                date: "2025-05-27"
            });

        expect(response.status).toBe(201);
        expect(response.body.transaction).toHaveProperty("id");
        expect(response.body.transaction.name).toBe("Salary");
        expect(response.body.transaction.amount).toBe(5000);
        expect(response.body.transaction.type).toBe("income");
    })


    it("Should update a transiction", async () => {
        const updateTransaction = await request(app)
            .post("/transactions")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Restaurant",
                description: "Dinner with friends",
                amount: 150,
                category: "food",
                type: "expense",
                date: "2025-05-20"
            })

        expect(updateTransaction.status).toBe(201);
        expect(updateTransaction.body.transaction).toHaveProperty("id");
    })


    it("Should list all transactions", async () => {
        const response = await request(app)
            .get("/transactions")
            .set("Authorization", `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.transactions)).toBe(true);
        expect(response.body.transactions.length).toBeGreaterThanOrEqual(1);
        expect(response.body.transactions[0]).toHaveProperty("id"); 
        expect(response.body.transactions[0]).toHaveProperty("name");
        expect(response.body.transactions[0]).toHaveProperty("amount");
    })
})