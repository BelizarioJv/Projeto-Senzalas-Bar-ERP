import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";
import "./paths/auth.docs.js";
import "./paths/customer.docs.js";
import "./paths/product.docs.js";
import "./paths/purchase.docs.js";
import "./paths/movimentStock.js";
import "./paths/sale.docs.js";
import "./paths/supplier.docs.js";
import "./paths/report.docs.js";
export const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "API Senzalas",
        version: "1.0.0",
        description: "ERP do Senzalas",
    },
    servers: [
        {
            url: "http://localhost:8080",
        },
    ],
});
