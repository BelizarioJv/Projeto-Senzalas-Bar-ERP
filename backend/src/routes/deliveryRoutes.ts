import express from "express";
import { DeliveryController } from "../controllers/deliveryController.js";

export const deliveryRouter = express.Router();

const deliveryController = new DeliveryController();

//POST /delivery - Criar venda
deliveryRouter.post("/", deliveryController.create);
