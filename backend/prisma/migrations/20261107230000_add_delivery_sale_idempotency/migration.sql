ALTER TABLE "Sale"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "idempotencyHash" TEXT;

CREATE UNIQUE INDEX "Sale_idempotencyKey_key" ON "Sale"("idempotencyKey");
