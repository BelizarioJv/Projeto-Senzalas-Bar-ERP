import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/database/prisma.js";
import { purchaseRouter } from "@/routes/purchaseRoutes.js";
import {
  authenticatedRequest,
  createAuthenticatedApp,
  testJwtSecret,
} from "../../helpers/authenticatedApp.js";

vi.mock("@/database/prisma.js", () => ({
  prisma: {
    purchase: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      aggregate: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const transactionClient = {
  purchase: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  product: {
    update: vi.fn(),
  },
  stockMovement: {
    create: vi.fn(),
  },
};

const app = createAuthenticatedApp("/purchase", purchaseRouter);

function useTransactionClient() {
  vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Expected an interactive transaction callback");
    }

    return callback(transactionClient as never) as never;
  });
}

//Testes de integração para as rotas de compras listagem de compras , criação de compras, exclusão de compras e total de compras do mês.
describe("purchase routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = testJwtSecret;
    vi.clearAllMocks();
    useTransactionClient();
  });

  it("lists purchases with pagination metadata", async () => {
    vi.mocked(prisma.purchase.findMany).mockResolvedValue([]);
    vi.mocked(prisma.purchase.count).mockResolvedValue(0);

    const response = await authenticatedRequest(app).get("/purchase");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [],
      meta: { page: 1, pageSize: 10, totalRecords: 0, totalPages: 0 },
    });
  });

  it("rejects a purchase without products", async () => {
    const response = await authenticatedRequest(app)
      .post("/purchase")
      .send({ supplierId: 1, products: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Falha na validação dos dados enviados.",
    );
    expect(transactionClient.purchase.create).not.toHaveBeenCalled();
  });

  it("creates a purchase and records stock entry", async () => {
    const purchase = { id: 11, total: 20 };
    vi.mocked(transactionClient.purchase.create).mockResolvedValue(
      purchase as never,
    );
    vi.mocked(transactionClient.product.update).mockResolvedValue({} as never);
    vi.mocked(transactionClient.stockMovement.create).mockResolvedValue(
      {} as never,
    );

    const response = await authenticatedRequest(app)
      .post("/purchase")
      .send({
        supplierId: 3,
        payment: "PIX",
        products: [{ productId: 5, quantity: 2, price: 10 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(purchase);
    expect(transactionClient.purchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          supplierId: 3,
          userId: 7,
          total: expect.anything(),
        }),
      }),
    );
    expect(transactionClient.product.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { costPrice: 10, currentQuantity: { increment: 2 } },
    });
    expect(transactionClient.stockMovement.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        productId: 5,
        purchaseId: 11,
        movementType: "ENTRADA",
        quantity: 2,
      }),
    });
  });

  it("returns a purchase by id", async () => {
    const purchase = { id: 11, total: 20 };
    vi.mocked(prisma.purchase.findUnique).mockResolvedValue(purchase as never);

    const response = await authenticatedRequest(app).get("/purchase/11");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(purchase);
  });

  it("returns 404 when a purchase does not exist", async () => {
    vi.mocked(prisma.purchase.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).get("/purchase/404");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Compra não encontrada." });
  });

  it("deletes a purchase and decrements its products from stock", async () => {
    vi.mocked(transactionClient.purchase.findUnique).mockResolvedValue({
      id: 11,
      products: [{ productId: 5, quantity: 2 }],
    } as never);
    vi.mocked(transactionClient.product.update).mockResolvedValue({} as never);
    vi.mocked(transactionClient.purchase.delete).mockResolvedValue({
      id: 11,
    } as never);

    const response = await authenticatedRequest(app).delete("/purchase/11");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 11 });
    expect(transactionClient.product.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { currentQuantity: { decrement: 2 } },
    });
  });

  it("returns 404 when deleting a missing purchase", async () => {
    vi.mocked(transactionClient.purchase.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).delete("/purchase/404");

    expect(response.status).toBe(404);
    expect(transactionClient.purchase.delete).not.toHaveBeenCalled();
  });

  it("returns the current month's purchase total", async () => {
    vi.mocked(prisma.purchase.aggregate).mockResolvedValue({
      _sum: { total: 123.45 },
    } as never);

    const response = await authenticatedRequest(app).get(
      "/purchase/monthly-total",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalPurchases: 123.45 });
  });

  it("returns zero when there are no purchases this month", async () => {
    vi.mocked(prisma.purchase.aggregate).mockResolvedValue({
      _sum: { total: null },
    } as never);

    const response = await authenticatedRequest(app).get(
      "/purchase/monthly-total",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalPurchases: 0 });
  });
});
