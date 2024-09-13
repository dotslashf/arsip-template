CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CreateIndex
CREATE INDEX "CopyPasta_content_idx" ON "CopyPasta" USING GIN ("content" gin_trgm_ops);
CREATE INDEX idx_copy_pasta_content ON "CopyPasta" USING gin(to_tsvector('indonesian', content));