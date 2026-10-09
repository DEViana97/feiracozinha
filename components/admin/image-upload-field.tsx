"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { uploadImageAction } from "@/lib/actions/upload";

type Pending = { src: string; name: string; mimeType: string };

// `aspect` (largura / altura) é a proporção em que a imagem aparece no site:
// o usuário vê uma prévia e escolhe o enquadramento antes do envio.
export function ImageUploadField({
  value,
  onChange,
  aspect = 1,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  aspect?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Imagem muito grande. Envie um arquivo de até 8MB.");
      return;
    }
    setPending({ src: URL.createObjectURL(file), name: file.name, mimeType: file.type });
  }

  function closePreview() {
    if (pending) URL.revokeObjectURL(pending.src);
    setPending(null);
  }

  function handleConfirm(blob: Blob) {
    if (!pending) return;
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const base = pending.name.replace(/\.[^.]+$/, "") || "imagem";
    const formData = new FormData();
    formData.append("file", new File([blob], `${base}.${ext}`, { type: blob.type }));
    closePreview();

    startTransition(async () => {
      try {
        onChange(await uploadImageAction(formData));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha no upload.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div
        className="relative flex w-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted"
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          <Image src={value} alt="Imagem" fill sizes="160px" className="object-cover" />
        ) : (
          <ImagePlus className="size-6 text-muted-foreground" />
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {value ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="size-3.5" />
            Remover
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />

      <ImageCropDialog
        open={!!pending}
        src={pending?.src ?? ""}
        mimeType={pending?.mimeType ?? "image/jpeg"}
        aspect={aspect}
        onCancel={closePreview}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
