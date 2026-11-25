-- Janelas de exibição por categoria: [{ "days": [3,4,5], "start": "06:00", "end": "15:00" }]
-- (0 = domingo; nulo ou vazio = sempre visível). Substitui as regras que estavam fixas no código.
ALTER TABLE "Category" ADD COLUMN "availability" JSONB;

-- Mantém o comportamento atual: Almoço Executivo (qua a sex, 06h às 15h) e Happy Hour (todos os dias, 15h às 20h).
UPDATE "Category"
SET "availability" = '[{"days":[3,4,5],"start":"06:00","end":"15:00"}]'::jsonb
WHERE "slug" = 'almoco-executivo';

UPDATE "Category"
SET "availability" = '[{"days":[0,1,2,3,4,5,6],"start":"15:00","end":"20:00"}]'::jsonb
WHERE "slug" = 'happy-hour';
