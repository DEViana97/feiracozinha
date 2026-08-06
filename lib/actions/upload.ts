"use server";

import { put } from "@vercel/blob";
import { auth } from "@/auth";

export async function uploadImageAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Não autorizado.");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Nenhum arquivo enviado.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Envie um arquivo de imagem.");
  }

  const blob = await put(`feira/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}
