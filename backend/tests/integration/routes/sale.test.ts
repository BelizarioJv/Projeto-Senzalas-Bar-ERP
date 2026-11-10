import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/database/prisma.js";
import { saleRouter } from "@/routes/saleRoutes.js";
import {
  authenticatedRequest,
  createAuthenticatedApp,
  testJwtSecret,
} from "../../helpers/authenticatedApp.js";

vi.mock("@/database/prisma.js", () => ({
  prisma: {
    sale: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      aggregate: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const transactionClient = {
  sale: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  customer: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
  stockMovement: {
    create: vi.fn(),
  },
};

const app = createAuthenticatedApp("/sale", saleRouter);

function useTransactionClient() {
  vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Expected an interactive transaction callback");
    }

    return callback(transactionClient as never) as never;
  });
}

//Testes de integração para as rotas de vendas listagem de vendas , criação de vendas, exclusão de vendas e total de vendas do mês.
describe("sale routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = testJwtSecret;
    vi.clearAllMocks();
    useTransactionClient();
  });

  it("lists sales with pagination metadata", async () => {
    vi.mocked(prisma.sale.findMany).mockResolvedValue([]);
    vi.mocked(prisma.sale.count).mockResolvedValue(0);

    const response = await authenticatedRequest(app).get("/sale");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [],
      meta: { page: 1, pageSize: 10, totalRecords: 0, totalPages: 0 },
    });
  });

  it("rejects a credit sale without a customer", async () => {
    const response = await authenticatedRequest(app)
      .post("/sale")
      .send({
        payment: "FIADO",
        products: [{ productId: 1, quantity: 1, price: 10 }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Falha na validação dos dados enviados.",
    );
    expect(transactionClient.sale.create).not.toHaveBeenCalled();
  });

  it("creates a sale, deducts inventory, and records the stock movement", async () => {
    const sale = { id: 21, total: 18 };
    vi.mocked(transactionClient.sale.create).mockResolvedValue(sale as never);
    vi.mocked(transactionClient.product.findUnique).mockResolvedValue({
      id: 5,
      name: "Test Beer",
      currentQuantity: 4,
    } as never);
    vi.mocked(transactionClient.product.updateMany).mockResolvedValue({
      count: 1,
    } as never);
    vi.mocked(transactionClient.stockMovement.create).mockResolvedValue(
      {} as never,
    );

    const response = await authenticatedRequest(app)
      .post("/sale")
      .send({
        payment: "PIX",
        discountPercent: 10,
        products: [{ productId: 5, quantity: 2, price: 10 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(sale);
    expect(transactionClient.sale.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 7,
          total: 18,
          discountValue: 2,
          payment: "PIX",
        }),
      }),
    );
    expect(transactionClient.product.updateMany).toHaveBeenCalledWith({
      where: { id: 5, currentQuantity: { gte: 2 } },
      data: { currentQuantity: { decrement: 2 } },
    });
    expect(transactionClient.stockMovement.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        productId: 5,
        saleId: 21,
        movementType: "SAIDA",
        quantity: 2,
      }),
    });
  });

  it("rejects a sale when inventory is insufficient", async () => {
    vi.mocked(transactionClient.sale.create).mockResolvedValue({
      id: 21,
    } as never);
    vi.mocked(transactionClient.product.findUnique).mockResolvedValue({
      id: 5,
      name: "Test Beer",
      currentQuantity: 1,
    } as never);

    const response = await authenticatedRequest(app)
      .post("/sale")
      .send({
        payment: "DINHEIRO",
        products: [{ productId: 5, quantity: 2, price: 10 }],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Estoque insuficiente");
    expect(transactionClient.product.updateMany).not.toHaveBeenCalled();
  });

  it("returns a sale by id", async () => {
    const sale = { id: 21, total: 20 };
    vi.mocked(prisma.sale.findUnique).mockResolvedValue(sale as never);

    const response = await authenticatedRequest(app).get("/sale/21");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(sale);
  });

  it("returns 404 when a sale does not exist", async () => {
    vi.mocked(prisma.sale.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).get("/sale/404");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Venda não encontrada." });
  });

  it("deletes a sale and restores its products to stock", async () => {
    vi.mocked(transactionClient.sale.findUnique).mockResolvedValue({
      id: 21,
      products: [{ productId: 5, quantity: 2 }],
    } as never);
    vi.mocked(transactionClient.product.update).mockResolvedValue({} as never);
    vi.mocked(transactionClient.sale.delete).mockResolvedValue({
      id: 21,
    } as never);

    const response = await authenticatedRequest(app).delete("/sale/21");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 21 });
    expect(transactionClient.product.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { currentQuantity: { increment: 2 } },
    });
  });

  it("returns 404 when deleting a missing sale", async () => {
    vi.mocked(transactionClient.sale.findUnique).mockResolvedValue(null);

    const response = await authenticatedRequest(app).delete("/sale/404");

    expect(response.status).toBe(404);
    expect(transactionClient.sale.delete).not.toHaveBeenCalled();
  });

  it("returns the current month's sales total", async () => {
    vi.mocked(prisma.sale.aggregate).mockResolvedValue({
      _sum: { total: 123.45 },
    } as never);

    const response = await authenticatedRequest(app).get("/sale/monthly-total");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ totalSales: 123.45 });
  });
});
