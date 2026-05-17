DELETE FROM "settings"
WHERE "id" NOT IN (
  SELECT "id"
  FROM "settings"
  ORDER BY "created_at" ASC
  LIMIT 1
);

ALTER TABLE "settings" ADD COLUMN "key" TEXT NOT NULL DEFAULT 'global';

CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
