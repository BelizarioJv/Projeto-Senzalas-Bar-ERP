import { Router } from "express";
import {
  getProductImageController,
  uploadProductImageController,
  uploadProductImageMiddleware,
} from "../controllers/s3ImageProductsController.js";

export const productImageRouter = Router();

productImageRouter.post(
  "/:id/image",
  uploadProductImageMiddleware,
  uploadProductImageController,
);

productImageRouter.get("/:id/image-url", getProductImageController);