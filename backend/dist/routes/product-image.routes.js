import { Router } from "express";
import { uploadProductImageController, uploadProductImageMiddleware, } from "../controllers/s3ImageProductsController.js";
export const productImageRouter = Router();
productImageRouter.post("/:id/image", uploadProductImageMiddleware, uploadProductImageController);
