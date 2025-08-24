import { app } from "@/app";
import { prisma } from "@/database/prisma";
import request from "supertest";



describe("UsersController", () => {
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
        await prisma.user.delete({ where: { id: userId } })
    })


    it("Should not create a user with same email", async () => {
        const user = await request(app).post("/users").send({
            name: "Duplicate User",
            email: "testeuser@example.com",
            password: "123456"
        })

        expect(user.status).toBe(400);
        expect(user.body.message).toBe("User already exists")

    })

    it("Should update user's name and password", async () => {
        const response = await request(app)
            .put("/users")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Upated User",
                password: "Password123",
                old_password: "123456"
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Upated User");
        expect(response.body).not.toHaveProperty("password");
    });




})
