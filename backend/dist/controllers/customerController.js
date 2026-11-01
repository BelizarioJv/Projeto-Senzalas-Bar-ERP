import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../database/prisma.js";
import { Prisma } from "@prisma/client";
import { CustomerRequestSchema, UpdateCustomerRequestSchema, MetaCustomerRequestSchema, } from "../docs/schemas/CustomerResquestSchema.js"; // Lembre-se de criar esses schemas parecidos com os de produto
export class CustomerController {
    // Listagem de clientes com paginação, ordenação e filtro por nome
    index = async (req, res, next) => {
        try {
            const query = MetaCustomerRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc", onlyDebtors, } = query;
            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);
            const where = {};
            if (name)
                where.name = { contains: name, mode: "insensitive" };
            if (onlyDebtors === "true")
                where.debtBalance = { gt: 0 };
            const customers = await prisma.customer.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: { [sortBy]: order },
            });
            const total = await prisma.customer.count({ where });
            res.json({
                data: customers,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages: Math.ceil(total / pageSizeNumber),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    allCustomers = async (req, res, next) => {
        try {
            const customers = await prisma.customer.findMany({
                orderBy: { name: "asc" },
            });
            res.json(customers);
        }
        catch (error) {
            next(error);
        }
    };
    // Busca um cliente pelo ID
    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const customer = await prisma.customer.findUnique({
                where: { id: Number(id) },
            });
            if (!customer) {
                throw new HttpError(404, "Customer not found");
            }
            res.json(customer);
        }
        catch (error) {
            next(error);
        }
    };
    // Criação de cliente
    create = async (req, res, next) => {
        try {
            const body = CustomerRequestSchema.parse(req.body);
            const newCustomer = await prisma.customer.create({
                data: {
                    ...body,
                    debtBalance: 0.0, // Garante que o cliente começa sem dívidas
                },
            });
            res.status(201).json(newCustomer);
        }
        catch (error) {
            next(error);
        }
    };
    // Atualizar dados do cliente
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const idNum = Number(id);
            const body = UpdateCustomerRequestSchema.parse(req.body);
            const updatedCustomer = await prisma.customer.update({
                where: { id: idNum },
                data: body,
            });
            res.json(updatedCustomer);
        }
        catch (error) {
            next(error);
        }
    };
    // Deletar Cliente
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await prisma.customer.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
    payDebt = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { amountToPay } = req.body;
            if (amountToPay <= 0) {
                throw new HttpError(400, "Amount to pay must be greater than zero");
            }
            const updatedCustomer = await prisma.$transaction(async (tx) => {
                const customer = await tx.customer.findUnique({
                    where: { id: Number(id) },
                });
                if (!customer) {
                    throw new HttpError(404, "Customer not found");
                }
                if (amountToPay > customer.debtBalance) {
                    throw new HttpError(400, "Amount to pay cannot be greater than the current debt balance");
                }
                return tx.customer.update({
                    where: { id: Number(id) },
                    data: {
                        debtBalance: new Prisma.Decimal(customer.debtBalance).minus(amountToPay),
                    },
                });
            });
            res.json({
                message: "Debt paid successfully",
                remainingDebt: updatedCustomer.debtBalance,
            });
        }
        catch (error) {
            next(error);
        }
    };
    // Retorna os indicadores (Métricas do Bar): total de cadastrados e total de devedores
    getDashboardMetrics = async (req, res, next) => {
        try {
            // Executa ambas as contagens em paralelo no banco para melhor performance
            const [totalCustomers, totalDebtors] = await prisma.$transaction([
                prisma.customer.count(),
                prisma.customer.count({
                    where: {
                        debtBalance: { gt: 0 },
                    },
                }),
            ]);
            return res.json({
                totalCustomers,
                totalDebtors,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
