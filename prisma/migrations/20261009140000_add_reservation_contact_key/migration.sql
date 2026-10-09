-- AlterTable: nullable primeiro, para preencher as reservas existentes.
ALTER TABLE "Reservation" ADD COLUMN "contactKey" TEXT;

WITH n AS (
  SELECT
    id,
    CASE
      WHEN regexp_replace(contact, '\D', '', 'g') ~ '^55'
        AND length(regexp_replace(contact, '\D', '', 'g')) > 11
      THEN substr(regexp_replace(contact, '\D', '', 'g'), 3)
      ELSE regexp_replace(contact, '\D', '', 'g')
    END AS d
  FROM "Reservation"
)
UPDATE "Reservation" r
SET "contactKey" = CASE WHEN length(n.d) >= 10 THEN left(n.d, 2) || right(n.d, 8) ELSE n.d END
FROM n
WHERE r.id = n.id;

ALTER TABLE "Reservation" ALTER COLUMN "contactKey" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Reservation_contactKey_idx" ON "Reservation"("contactKey");
