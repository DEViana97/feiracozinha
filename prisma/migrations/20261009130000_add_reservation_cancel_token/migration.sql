-- AlterTable: coluna nasce nullable para poder preencher as reservas já existentes.
ALTER TABLE "Reservation" ADD COLUMN "cancelToken" TEXT;

UPDATE "Reservation" SET "cancelToken" = gen_random_uuid()::text WHERE "cancelToken" IS NULL;

ALTER TABLE "Reservation" ALTER COLUMN "cancelToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_cancelToken_key" ON "Reservation"("cancelToken");
