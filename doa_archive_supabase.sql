CREATE TABLE "profiles"(
    "id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "profiles" ADD PRIMARY KEY("id");
CREATE TABLE "entries"(
    "id" UUID NOT NULL DEFAULT UUID(), "title" VARCHAR(255) NOT NULL, "slug" VARCHAR(255) NOT NULL, "type" VARCHAR(50) NOT NULL, "summary" TEXT NULL, "gated_content" TEXT NULL, "is_gated" BOOLEAN NOT NULL, "is_published" BOOLEAN NOT NULL, "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" UUID NOT NULL);
ALTER TABLE
    "entries" ADD PRIMARY KEY("id");
ALTER TABLE
    "entries" ADD CONSTRAINT "entries_slug_unique" UNIQUE("slug");
CREATE TABLE "embeddings"(
    "id" UUID NOT NULL DEFAULT UUID(), "entry_id" UUID NOT NULL, "content_chunk" TEXT NOT NULL, "embedding" TEXT NOT NULL, "is_gated" BOOLEAN NOT NULL, "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE
    "embeddings" ADD PRIMARY KEY("id");
ALTER TABLE
    "embeddings" ADD CONSTRAINT "embeddings_entry_id_foreign" FOREIGN KEY("entry_id") REFERENCES "entries"("id");
ALTER TABLE
    "entries" ADD CONSTRAINT "entries_created_by_foreign" FOREIGN KEY("created_by") REFERENCES "profiles"("id");
