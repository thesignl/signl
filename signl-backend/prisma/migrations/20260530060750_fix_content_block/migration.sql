/*
  Warnings:

  - Added the required column `content` to the `ContentBlock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContentBlock" ADD COLUMN     "content" JSONB NOT NULL;
