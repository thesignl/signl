-- ArticleTag: add ON DELETE CASCADE so article deletion cleans up tags
ALTER TABLE "ArticleTag" DROP CONSTRAINT "ArticleTag_articleId_fkey";

ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ReadingHistory: index lastReadAt for analytics range queries
CREATE INDEX "ReadingHistory_lastReadAt_idx" ON "ReadingHistory"("lastReadAt");
