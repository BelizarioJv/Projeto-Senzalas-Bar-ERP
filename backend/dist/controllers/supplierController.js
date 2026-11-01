import { prisma } from "../database/prisma.js";
import { SupplierRequestSchema, UpdateSupplierRequestSchema, } from "../docs/schemas/SupplierRequestSchema.js";
import { HttpError } from "../errors/HttpError.js";
//Controller de fornecedores com as operações de CRUD e listagem.
export class SupplierController {
    //Buscar fornecedor
    index = async (req, res, next) => {
        try {
            const supplier = await prisma.supplier.findMany();
            res.json({ data: supplier });
        }
        catch (error) {
            next(error);
        }
    };
    //Criar forncedor
    create = async (req, res, next) => {
        try {
            const body = SupplierRequestSchema.parse(req.body);
            const newSupplier = await prisma.supplier.create({
                data: body,
            });
            res.status(201).json(newSupplier);
        }
        catch (error) {
            next(error);
        }
    };
    //Mostrar dados forcedor
    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = await prisma.supplier.findUnique({
                where: { id: Number(id) },
                //include:,
            });
            if (!category) {
                throw new HttpError(404, "Category not found");
            }
            res.json(category);
        }
        catch (error) {
            next(error);
        }
    };
    //Deletar forneecedor
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await prisma.supplier.delete({
                where: { id: Number(id) },
                // include:,
            });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
    //Atualizar fornecedor
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = UpdateSupplierRequestSchema.parse(req.body);
            const updatedSupllier = await prisma.supplier.update({
                where: { id: Number(id) },
                data: body,
            });
            res.json(updatedSupllier);
        }
        catch (error) {
            next(error);
        }
    };
}
