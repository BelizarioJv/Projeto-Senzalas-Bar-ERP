import cors from "cors";
import { rateLimit } from "express-rate-limit";
import express, { type Express } from "express";
import helmet from "helmet";

const allowedOrigins = (
  process.env.CORS_ORIGINS ??
  "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Muitas tentativas de login. Tente novamente mais tarde." },
});

export function configureServer(app: Express): void {
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin));
      },
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));
}
