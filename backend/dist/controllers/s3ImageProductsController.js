import multer from "multer";
import { prisma } from "../database/prisma.js";
import { HttpError } from "../errors/HttpError.js";
import { createProductImageUrl, deleteProductImage, uploadProductImage, } from "../services/product-image.service.js";
export const uploadProductImageMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (_req, file, callback) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return callback(new Error("Envie JPG, PNG ou WebP"));
        }
        callback(null, true);
    },
}).single("image");
export const uploadProductImageController = async (req, res, next) => {
    try {
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId)) {
            throw new HttpError(400, "ID do produto inválido");
        }
        if (!req.file) {
            throw new HttpError(400, "Selecione uma imagem");
        }
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { imageKey: true },
        });
        if (!product) {
            throw new HttpError(404, "Produto não encontrado");
        }
        const image = await uploadProductImage(req.file);
        const publicBaseUrl = process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, "");
        const imageUrl = publicBaseUrl
            ? `${publicBaseUrl}/${image.key}`
            : undefined;
        await prisma.product.update({
            where: { id: productId },
            data: {
                imageKey: image.key,
                imageType: req.file.mimetype,
                imageUrl,
            },
        });
        if (product.imageKey && product.imageKey !== image.key) {
            await deleteProductImage(product.imageKey);
        }
        return res.status(200).json({
            message: "Imagem enviada com sucesso",
            imageKey: image.key,
            imageUrl,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getProductImageController = async (req, res, next) => {
    try {
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId)) {
            throw new HttpError(400, "ID do produto inválido");
        }
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { imageKey: true },
        });
        if (!product?.imageKey) {
            throw new HttpError(404, "Imagem do produto não encontrada");
        }
        const imageUrl = await createProductImageUrl(product.imageKey);
        return res.json({ imageUrl });
    }
    catch (error) {
        next(error);
    }
};
