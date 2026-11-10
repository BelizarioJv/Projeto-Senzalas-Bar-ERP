import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "@/middlewares/errorMiddleware.js";
import { loginRateLimiter } from "@/config/server.config.js";
import { loginRouter } from "@/routes/loginRoutes.js";
import { prisma } from "@/database/prisma.js";

vi.mock("@/database/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/login", loginRateLimiter, loginRouter);
app.use(errorHandler);

const findUser = vi.mocked(prisma.user.findUnique);
const password = "test-password";
const userId = 7;
const jwtSecret = "test-only-jwt-secret";

//Teste de integração para a rota de login
describe("POST /login", () => {
  beforeEach(async () => {
    process.env.JWT_SECRET = jwtSecret;
    findUser.mockReset();
    findUser.mockResolvedValue({
      id: userId,
      name: "Test User",
      user: "testuser",
      password: await bcrypt.hash(password, 4),
      createdAt: new Date(),
    });
  });

  it("returns a JWT for valid credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ user: " TestUser ", password });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe("string");
    expect(() => jwt.verify(response.body.token, jwtSecret)).not.toThrow();
    expect(findUser).toHaveBeenCalledWith({
      where: { user: "testuser" },
    });
  });

  it("rejects an incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ user: "testuser", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Senha inválida" });
  });

  it("rejects an invalid request body", async () => {
    const response = await request(app)
      .post("/login")
      .send({ user: 123, password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Falha na validação dos dados enviados.",
    );
    expect(findUser).not.toHaveBeenCalled();
  });
});
