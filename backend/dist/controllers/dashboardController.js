import { prisma } from "../database/prisma.js";
import { MetaStockMovementRequestSchema } from "../docs/schemas/MovementStockRequestSchema.js";
import { getStartOfToday, getStartOfMonth } from "../utils/date.js";
export class DashboardController {
    //Busca de informaçaoes para mostrar no Dashboard principal , total de produtos , produtos com abaixo do estoque minimo , vendas de hoje e do mes
    index = async (req, res, next) => {
        try {
            const totalProducts = await prisma.product.count({
                where: {
                    status: "ATIVO",
                },
            });
            const products = await prisma.product.findMany({
                select: {
                    currentQuantity: true,
                    minimumQuantity: true,
                },
            });
            const lowStockProducts = products.filter((product) => product.currentQuantity <= product.minimumQuantity).length;
            const todaySales = await prisma.sale.aggregate({
                _sum: {
                    total: true,
                },
                where: {
                    dateTime: {
                        gte: getStartOfToday(),
                    },
                },
            });
            const monthSales = await prisma.sale.aggregate({
                _sum: {
                    total: true,
                },
                where: {
                    dateTime: {
                        gte: getStartOfMonth(),
                    },
                },
            });
            res.json({
                totalProducts,
                lowStockProducts,
                todaySales: Number(todaySales._sum.total ?? 0),
                monthSales: Number(monthSales._sum.total ?? 0),
            });
        }
        catch (error) {
            next(error);
        }
    };
    //Buscar dados de movimentaçoes de estoque
    stockMovement = async (req, res, next) => {
        try {
            const meta = MetaStockMovementRequestSchema.parse(req.query);
            const [movements, total] = await Promise.all([
                prisma.stockMovement.findMany({
                    skip: (meta.page - 1) * meta.pageSize,
                    take: meta.pageSize,
                    include: {
                        product: true,
                        purchase: true,
                        sale: true,
                    },
                    orderBy: {
                        [meta.sortBy]: meta.order,
                    },
                }),
                prisma.stockMovement.count(),
            ]);
            res.json({
                data: movements,
                meta: {
                    page: meta.page,
                    pageSize: meta.pageSize,
                    total,
                    totalPages: Math.ceil(total / meta.pageSize),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
