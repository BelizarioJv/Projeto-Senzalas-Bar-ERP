import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { prisma } from "@/database/prisma.js";
import { productRouter } from "@/routes/productRoutes.js";
import {
  authenticatedRequest,
  createAuthenticatedApp,
  testJwtSecret,
} from "../../helpers/authenticatedApp.js";

vi.mock("@/database/prisma.js", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

const app = createAuthenticatedApp("/products", productRouter);

//Testes de integração para as rotas de produtos listagem de produtos , criação de produtos, atualização de produtos e exclusão de produtos.
describe("product routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = testJwtSecret;
    vi.clearAllMocks();
  });

  it("lists products with pagination metadata", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);
    vi.mocked(prisma.product.count).mockResolvedValue(0);

    const response = await authenticatedRequest(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [],
      meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  });

  it("rejects invalid product data without writing to the database", async () => {
    const response = await authenticatedRequest(app)
      .post("/products")
      .send({ name: "", category: "INVALID" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Falha na validação dos dados enviados.",
    );
    expect(prisma.product.create).not.toHaveBeenCalled();
  });

  it("rejects requests without an authentication token", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Token não fornecido" });
  });

  it("lists products below their minimum stock using the raw stock query", async () => {
    const lowStockProducts = [
      { id: 1, name: "Product A", currentQuantity: 2, minimumQuantity: 5 },
      { id: 2, name: "Product B", currentQuantity: 3, minimumQuantity: 4 },
    ];
    vi.mocked(prisma.$queryRaw).mockResolvedValue(lowStockProducts);

    const response = await authenticatedRequest(app).get("/products/low-stock");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(lowStockProducts);
    expect(prisma.$queryRaw).toHaveBeenCalledOnce();
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it("returns a product by id", async () => {
    const product = { id: 1, name: "Product A" };
    vi.mocked(prisma.product.findUnique).mockResolvedValue(product as never);

    const response = await authenticatedRequest(app).get("/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(product);
    expect(prisma.product.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it("returns 404 when a product does not exist", async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).get("/products/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Product not found" });
  });

  it("creates a product for the authenticated user", async () => {
    const product = { id: 1, name: "Test Beer", createdBy: 7 };
    vi.mocked(prisma.product.create).mockResolvedValue(product as never);

    const response = await authenticatedRequest(app).post("/products").send({
      name: "Test Beer",
      category: "CERVEJA",
      unitMeasure: "UNIDADE",
      costPrice: 5,
      salePrice: 8,
      minimumQuantity: 3,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(product);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "Test Beer", createdBy: 7 }),
    });
  });

  it("updates a product", async () => {
    const product = { id: 1, name: "Updated Beer" };
    vi.mocked(prisma.product.update).mockResolvedValue(product as never);

    const response = await authenticatedRequest(app)
      .put("/products/1")
      .send({ name: "Updated Beer", category: "CERVEJA" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(product);
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: "Updated Beer", category: "CERVEJA" },
    });
  });

  it("deletes a product", async () => {
    vi.mocked(prisma.product.delete).mockResolvedValue({ id: 1 } as never);

    const response = await authenticatedRequest(app).delete("/products/1");

    expect(response.status).toBe(204);
    expect(prisma.product.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
