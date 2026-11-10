import express, { type Router } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { errorHandler } from "@/middlewares/errorMiddleware.js";
import { authMiddleware } from "@/middlewares/authMiddleware.js";

export const testJwtSecret = "integration-test-secret";

//Funçao para criar uma aplicação express autenticada para testes
export function createAuthenticatedApp(path: string, router: Router) {
  const app = express();
  app.use(express.json());
  app.use(authMiddleware);
  app.use(path, router);
  app.use(errorHandler);
  return app;
}

export function authenticatedRequest(app: express.Express) {
  const token = jwt.sign({ id: 7 }, testJwtSecret);
  const authorization = `Bearer ${token}`;

  const withToken = (method: "get" | "post" | "put" | "delete", path: string) =>
    request(app)[method](path).set("Authorization", authorization);

  return {
    get: (path: string) => withToken("get", path),
    post: (path: string) => withToken("post", path),
    put: (path: string) => withToken("put", path),
    delete: (path: string) => withToken("delete", path),
  };
}
