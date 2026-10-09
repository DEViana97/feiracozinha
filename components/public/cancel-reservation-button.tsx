"use client";

import { useState, useTransition } from "react";
import { cancelReservationByToken } from "@/lib/actions/reservation";

export function CancelReservationButton({
  token,
  alreadyCancelled,
  locked,
}: {
  token: string;
  alreadyCancelled: boolean;
  locked: boolean;
}) {
  const [cancelled, setCancelled] = useState(alreadyCancelled);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (cancelled) {
    return (
      <p className="rounded-md bg-dark-wine px-4 py-3 text-center text-[13.5px] text-floral-white">
        Reserva cancelada. A mesa foi liberada.
      </p>
    );
  }

  if (locked) {
    return (
      <p className="text-[13.5px] leading-relaxed text-taupe">
        Essa reserva já começou e não pode mais ser cancelada por aqui.
      </p>
    );
  }

  function handleCancel() {
    startTransition(async () => {
      try {
        const result = await cancelReservationByToken(token);
        if (result.ok) setCancelled(true);
        else setError(result.error);
      } catch {
        setError("Não foi possível cancelar. Tente novamente.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-md border border-dark-wine bg-transparent py-3.5 font-sans text-[14.5px] font-semibold text-dark-wine"
        >
          Cancelar minha reserva
        </button>
      ) : (
        <>
          <p className="m-0 text-[13.5px] text-taupe">
            Tem certeza? Essa ação libera a mesa e não pode ser desfeita.
          </p>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="rounded-md bg-dark-wine py-3.5 font-sans text-[14.5px] font-semibold text-floral-white disabled:opacity-60"
          >
            {isPending ? "Cancelando..." : "Sim, cancelar"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="py-2 text-[13px] font-semibold text-taupe"
          >
            Voltar
          </button>
        </>
      )}
      {error && <span className="text-xs text-[#8b3a2e]">{error}</span>}
    </div>
  );
}
