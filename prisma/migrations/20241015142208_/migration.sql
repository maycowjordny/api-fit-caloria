-- CreateTable
CREATE TABLE "Diet" (
    "IDT_DIET" TEXT NOT NULL,
    "NUM_QUANTITY" INTEGER,
    "DES_DESCRIPTION" TEXT[],
    "DAT_CREATED" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DAT_UPDATED" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("IDT_DIET")
);

-- CreateTable
CREATE TABLE "PaymentSession" (
    "IDT_PAYMENT_SESSION" TEXT NOT NULL,
    "SESSION_ID" TEXT NOT NULL,
    "DES_EMAIL" TEXT NOT NULL,
    "FLAG_IS_PAID" BOOLEAN NOT NULL,
    "DAT_CREATED" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DAT_UPDATED" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSession_pkey" PRIMARY KEY ("IDT_PAYMENT_SESSION")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diet_NUM_QUANTITY_key" ON "Diet"("NUM_QUANTITY");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSession_SESSION_ID_key" ON "PaymentSession"("SESSION_ID");
