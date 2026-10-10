"use client";

import { useRef, useState } from "react";

export type BackgroundClip = { src: string; poster: string };

// Duração do cruzamento entre dois vídeos (segundos). O próximo começa a tocar
// um pouco antes do atual terminar, enquanto um sobe e o outro some.
const FADE_SECONDS = 1;

// Toca os vídeos em sequência (mudo, sem controles) com transição suave e volta
// ao primeiro no fim. Todos ficam montados e empilhados, então o próximo já está
// carregado quando chega a vez dele.
export function BackgroundVideo({
  clips,
  className,
}: {
  clips: BackgroundClip[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const fading = useRef(false);

  function handleTimeUpdate(i: number) {
    const video = refs.current[i];
    if (!video || i !== active || fading.current || clips.length < 2) return;
    if (!video.duration || video.duration - video.currentTime > FADE_SECONDS) return;

    const next = (i + 1) % clips.length;
    const nextVideo = refs.current[next];
    if (!nextVideo) return;
    fading.current = true;
    nextVideo.currentTime = 0;
    void nextVideo.play().catch(() => {});
    setActive(next);
  }

  function handleEnded(i: number) {
    if (clips.length < 2) return;
    // O vídeo que acabou de sair já está invisível: volta ao início e para.
    if (i !== active) {
      const video = refs.current[i];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      fading.current = false;
    }
  }

  return (
    <>
      {clips.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-hidden
          autoPlay={i === 0}
          loop={clips.length < 2}
          muted
          playsInline
          preload="auto"
          poster={clip.poster}
          className={`absolute inset-0 ${className ?? ""} transition-opacity ease-in-out`}
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE_SECONDS}s`,
          }}
          onTimeUpdate={() => handleTimeUpdate(i)}
          onEnded={() => handleEnded(i)}
        >
          <source src={clip.src} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
