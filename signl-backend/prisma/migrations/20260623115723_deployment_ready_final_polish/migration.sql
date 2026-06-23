/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[short]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "short" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "twitter" TEXT;

-- DropTable
DROP TABLE "Author";

-- CreateIndex
CREATE UNIQUE INDEX "Category_short_key" ON "Category"("short");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
