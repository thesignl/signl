/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'QUOTE', 'CODE', 'EMBED', 'HEADING', 'LIST');

-- CreateEnum
CREATE TYPE "DepthType" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content",
ADD COLUMN     "signal" TEXT,
ALTER COLUMN "readTime" SET DEFAULT 5,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleDepth" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "depthType" "DepthType" NOT NULL,
    "description" "DepthType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisStep" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stepNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepagePlacement" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepagePlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleAnalytics" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "avgReadTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentBlock_articleId_idx" ON "ContentBlock"("articleId");

-- CreateIndex
CREATE INDEX "ContentBlock_position_idx" ON "ContentBlock"("position");

-- CreateIndex
CREATE INDEX "ArticleDepth_articleId_idx" ON "ArticleDepth"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleDepth_articleId_depthType_key" ON "ArticleDepth"("articleId", "depthType");

-- CreateIndex
CREATE INDEX "AnalysisStep_articleId_idx" ON "AnalysisStep"("articleId");

-- CreateIndex
CREATE INDEX "AnalysisStep_stepNumber_idx" ON "AnalysisStep"("stepNumber");

-- CreateIndex
CREATE INDEX "HomepagePlacement_articleId_idx" ON "HomepagePlacement"("articleId");

-- CreateIndex
CREATE INDEX "HomepagePlacement_section_idx" ON "HomepagePlacement"("section");

-- CreateIndex
CREATE INDEX "HomepagePlacement_priority_idx" ON "HomepagePlacement"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleAnalytics_articleId_key" ON "ArticleAnalytics"("articleId");

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleDepth" ADD CONSTRAINT "ArticleDepth_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisStep" ADD CONSTRAINT "AnalysisStep_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepagePlacement" ADD CONSTRAINT "HomepagePlacement_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAnalytics" ADD CONSTRAINT "ArticleAnalytics_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
