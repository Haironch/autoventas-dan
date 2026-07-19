-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('LEVE', 'MODERADA', 'GRAVE');

-- CreateTable
CREATE TABLE "CommonIssue" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IssueSeverity" NOT NULL,
    "estimatedRepairCost" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommonIssue_pkey" PRIMARY KEY ("id")
);
