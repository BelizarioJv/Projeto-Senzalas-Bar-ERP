import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/database/prisma.js";
import { supplierRouter } from "@/routes/supplierRoutes.js";
import {
  authenticatedRequest,
  createAuthenticatedApp,
  testJwtSecret,
} from "../../helpers/authenticatedApp.js";

vi.mock("@/database/prisma.js", () => ({
  prisma: {
    supplier: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const app = createAuthenticatedApp("/supplier", supplierRouter);

//Teste de integração para as rotas de fornecedores listagem de fornecedores , criação de fornecedores, atualização de fornecedores e exclusão de fornecedores.
describe("supplier routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = testJwtSecret;
    vi.clearAllMocks();
  });

  it("lists suppliers", async () => {
    vi.mocked(prisma.supplier.findMany).mockResolvedValue([]);

    const response = await authenticatedRequest(app).get("/supplier");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });

  it("rejects an invalid supplier email without writing to the database", async () => {
    const response = await authenticatedRequest(app)
      .post("/supplier")
      .send({ name: "Fornecedor de teste", email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Falha na validação dos dados enviados.",
    );
    expect(prisma.supplier.create).not.toHaveBeenCalled();
  });

  it("returns a supplier by id", async () => {
    const supplier = { id: 2, name: "Test supplier" };
    vi.mocked(prisma.supplier.findUnique).mockResolvedValue(supplier as never);

    const response = await authenticatedRequest(app).get("/supplier/2");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(supplier);
    expect(prisma.supplier.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
    });
  });

  it("returns 404 when a supplier does not exist", async () => {
    vi.mocked(prisma.supplier.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).get("/supplier/404");

    expect(response.status).toBe(404);
  });

  it("creates a supplier", async () => {
    const supplier = { id: 2, name: "Test supplier" };
    vi.mocked(prisma.supplier.create).mockResolvedValue(supplier as never);

    const response = await authenticatedRequest(app)
      .post("/supplier")
      .send({ name: "Test supplier", email: "supplier@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(supplier);
    expect(prisma.supplier.create).toHaveBeenCalledWith({
      data: { name: "Test supplier", email: "supplier@example.com" },
    });
  });

  it("updates a supplier", async () => {
    const supplier = { id: 2, name: "Updated supplier" };
    vi.mocked(prisma.supplier.update).mockResolvedValue(supplier as never);

    const response = await authenticatedRequest(app)
      .put("/supplier/2")
      .send({ name: "Updated supplier" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(supplier);
    expect(prisma.supplier.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { name: "Updated supplier" },
    });
  });

  it("deletes a supplier", async () => {
    vi.mocked(prisma.supplier.delete).mockResolvedValue({ id: 2 } as never);

    const response = await authenticatedRequest(app).delete("/supplier/2");

    expect(response.status).toBe(204);
    expect(prisma.supplier.delete).toHaveBeenCalledWith({
      where: { id: 2 },
    });
  });
});
