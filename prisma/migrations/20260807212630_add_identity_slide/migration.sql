-- CreateTable
CREATE TABLE "IdentitySlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentitySlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IdentitySlide_order_idx" ON "IdentitySlide"("order");
