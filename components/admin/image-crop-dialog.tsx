"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MAX_ZOOM = 4;
const MAX_OUTPUT_WIDTH = 1600;

type Props = {
  open: boolean;
  src: string;
  mimeType: string;
  aspect: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

// Prévia da imagem antes do upload: o usuário arrasta para reposicionar e usa
// o zoom para escolher o recorte, na proporção em que a imagem aparece no site.
export function ImageCropDialog({ open, src, mimeType, aspect, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar imagem</DialogTitle>
          <DialogDescription>
            Arraste para reposicionar e use o zoom. A área mostrada é a que vai aparecer no site.
          </DialogDescription>
        </DialogHeader>
        {open && src && (
          <Cropper
            key={src}
            src={src}
            mimeType={mimeType}
            aspect={aspect}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function Cropper({ src, mimeType, aspect, onCancel, onConfirm }: Omit<Props, "open">) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [frameW, setFrameW] = useState(0);
  const [zoom, setZoom] = useState(1);
  // Centro do recorte em coordenadas normalizadas (0..1) da imagem original.
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setFrameW(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ready = !!nat && frameW > 0;
  const frameH = frameW / aspect;
  const scale = ready ? Math.max(frameW / nat.w, frameH / nat.h) * zoom : 1;
  // Parte da imagem original visível no quadro, em pixels originais.
  const visW = ready ? frameW / scale : 0;
  const visH = ready ? frameH / scale : 0;
  const cx = ready ? clamp(center.x, visW / 2 / nat.w, 1 - visW / 2 / nat.w) : 0.5;
  const cy = ready ? clamp(center.y, visH / 2 / nat.h, 1 - visH / 2 / nat.h) : 0.5;
  const sx = ready ? cx * nat.w - visW / 2 : 0;
  const sy = ready ? cy * nat.h - visH / 2 : 0;

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag.current || !ready) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setCenter({ x: cx - dx / scale / nat.w, y: cy - dy / scale / nat.h });
  }

  function handlePointerUp() {
    drag.current = null;
  }

  function handleWheel(e: React.WheelEvent) {
    setZoom((z) => clamp(+(z - e.deltaY * 0.002).toFixed(3), 1, MAX_ZOOM));
  }

  function handleConfirm() {
    const img = imgRef.current;
    if (!img || !ready) return;
    const outW = Math.round(Math.min(MAX_OUTPUT_WIDTH, visW));
    const outH = Math.round(outW / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, visW, visH, 0, 0, outW, outH);
    canvas.toBlob(
      (blob) => blob && onConfirm(blob),
      mimeType === "image/png" ? "image/png" : "image/jpeg",
      0.9
    );
  }

  return (
    <>
      <div
        ref={frameRef}
        className="relative w-full cursor-grab touch-none select-none overflow-hidden rounded-lg border border-border bg-muted active:cursor-grabbing"
        style={{ aspectRatio: aspect }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Prévia"
          draggable={false}
          onLoad={(e) =>
            setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
          }
          className="pointer-events-none absolute max-w-none"
          style={
            ready
              ? {
                  width: nat.w * scale,
                  height: nat.h * scale,
                  left: -sx * scale,
                  top: -sy * scale,
                }
              : { visibility: "hidden" }
          }
        />
      </div>

      <div className="flex items-center gap-3">
        <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom"
          className="h-2 w-full cursor-pointer accent-[var(--primary)]"
        />
        <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleConfirm} disabled={!ready}>
          Usar imagem
        </Button>
      </DialogFooter>
    </>
  );
}
