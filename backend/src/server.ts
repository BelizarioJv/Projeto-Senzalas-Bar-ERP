//Servidor

import "dotenv/config";
import { loginRouter } from "./routes/loginRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { productImageRouter } from "./routes/productImageS3Routes.js";
import { billingRouter } from "./routes/billingRoutes.js";
import { supplierRouter } from "./routes/supplierRoutes.js";
import { customerRouter } from "./routes/customerRoutes.js";
import { purchaseRouter } from "./routes/purchaseRoutes.js";
import { saleRouter } from "./routes/saleRoutes.js";
import { paymentRouter } from "./routes/paymentsRoutes.js";
import { dashboardRouter } from "./routes/dashboardRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { initMonthlyBillingJob } from "./jobs/monthlyBilling.job.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/swagger.js";
import {
  configureServer,
  loginRateLimiter,
} from "./config/server.config.js";

import express from "express";
import { reportsRouter } from "./routes/reportsRoutes.js";
import { deliveryRouter } from "./routes/deliveryRoutes.js";

const app = express();

configureServer(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// ---------------------------------
app.use("/login", loginRateLimiter, loginRouter);
app.use("/products", authMiddleware, productRouter);
app.use("/products", authMiddleware, productImageRouter);
app.use("/customer", authMiddleware, customerRouter);
app.use("/supplier", authMiddleware, supplierRouter);
app.use("/purchase", authMiddleware, purchaseRouter);
app.use("/sale", authMiddleware, saleRouter);
app.use("/payments", authMiddleware, paymentRouter);
app.use("/dashboard", authMiddleware, dashboardRouter);
app.use("/reports", authMiddleware, reportsRouter);
app.use("/delivery", authMiddleware, deliveryRouter);
app.use("/apiBilling", billingRouter);

// Middleware de erro
app.use(errorHandler);

//Inicaliza o contador para Datas e cobranças mensais
initMonthlyBillingJob();

// ---------------------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
