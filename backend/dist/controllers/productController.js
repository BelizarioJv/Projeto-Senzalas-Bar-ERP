import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../database/prisma.js";
import { ProductRequestSchema, UpdateProductRequestSchema, MetaProductRequestSchema, } from "../docs/schemas/ProductRequestSchema.js";
//Controller de produtos com as operações de CRUD e listagem com paginação, ordenação e filtro por nome.
export class ProductController {
    //Busca de produtos com paginação
    index = async (req, res, next) => {
        try {
            const query = MetaProductRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc", } = query;
            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);
            const where = {};
            if (name)
                where.name = { contains: name, mode: "insensitive" };
            const product = await prisma.product.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: { [sortBy]: order },
            });
            const total = await prisma.product.count({ where });
            res.json({
                data: product,
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
    //Busca produtos
    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: { id: Number(id) },
                include: {
                    usuario: {
                        select: { id: true, name: true },
                    },
                },
            });
            if (!product) {
                throw new HttpError(404, "Product not found");
            }
            res.json(product);
        }
        catch (error) {
            next(error);
        }
    };
    //Criaçao de produtos
    create = async (req, res, next) => {
        try {
            const body = ProductRequestSchema.parse(req.body);
            if (!req.user || typeof req.user !== "number") {
                throw new HttpError(401, "Usuário não autenticado ou inválido");
            }
            const userId = req.user;
            const newProduct = await prisma.product.create({
                data: {
                    ...body,
                    createdBy: userId ? Number(userId) : null,
                },
            });
            res.status(201).json(newProduct);
        }
        catch (error) {
            next(error);
        }
    };
    //Deletar Produto
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await prisma.product.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
    //Atualizar produto
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const idNum = Number(id);
            const body = UpdateProductRequestSchema.parse(req.body);
            const updatedProduct = await prisma.product.update({
                where: { id: idNum },
                data: body,
            });
            res.json(updatedProduct);
        }
        catch (error) {
            if (error instanceof HttpError) {
                throw new HttpError(404, "Product not found");
            }
            next(error);
        }
    };
    getProductsLowStock = async (req, res, next) => {
        try {
            const lowStockProducts = await prisma.$queryRaw `
        SELECT * 
        FROM "Product"
        WHERE "currentQuantity" < "minimumQuantity";
      `;
            return res.json(lowStockProducts);
        }
        catch (error) {
            next(error);
        }
    };
}
