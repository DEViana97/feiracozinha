"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { findMyReservations, type MyReservation } from "@/lib/actions/reservation";
import { saveContact, useSavedContact } from "@/lib/my-reservations";

const inputClass =
  "w-full rounded-md border border-iron-grey/30 bg-[#FFFDF9] px-3 py-[11px] font-sans text-sm text-[#3B2A26] outline-none focus:border-dark-wine focus:ring-1 focus:ring-dark-wine";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[1px] text-iron-grey";

export function MyReservations() {
  const saved = useSavedContact();
  const [form, setForm] = useState({ name: "", contact: "" });
  const [rows, setRows] = useState<MyReservation[] | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const autoSearched = useRef(false);

  function search(values: { name: string; contact: string }) {
    setError("");
    startTransition(async () => {
      try {
        setRows(await findMyReservations(values));
        saveContact({ name: values.name.trim(), contact: values.contact.trim() });
      } catch {
        setError("Não foi possível buscar agora. Tente novamente em instantes.");
      }
    });
  }

  // Se este aparelho já fez uma reserva, busca sozinho com os dados salvos.
  useEffect(() => {
    if (!saved || autoSearched.current) return;
    autoSearched.current = true;
    findMyReservations(saved)
      .then((r) => {
        setForm(saved);
        setRows(r);
      })
      .catch(() => setError("Não foi possível buscar agora. Tente novamente em instantes."));
  }, [saved]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.contact.replace(/\D/g, "").length < 10) {
      setError("Informe seu nome e um WhatsApp válido com DDD.");
      return;
    }
    search(form);
  }

  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <h1 className="m-0 mb-1.5 font-serif text-[26px] text-espresso">Minhas reservas</h1>
      <p className="mb-6 text-[13.5px] leading-relaxed text-taupe">
        Informe o nome e o WhatsApp usados na reserva para ver e gerenciar suas mesas, em
        qualquer aparelho.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nome</label>
          <input
            type="text"
            placeholder="Nome usado na reserva"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            type="tel"
            placeholder="(85) 99999-0000"
            value={form.contact}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-dark-wine py-3.5 font-sans text-[14.5px] font-semibold text-floral-white disabled:opacity-60"
        >
          {isPending ? "Buscando..." : "Buscar minhas reservas"}
        </button>
        {error && <span className="text-xs text-[#8b3a2e]">{error}</span>}
      </form>

      <div className="flex flex-col gap-3">
        {(rows ?? []).map((r) => {
          const dateLabel = new Date(`${r.date}T00:00:00`).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          });
          const cancelled = r.status === "CANCELLED";
          const past = !cancelled && r.locked;
          return (
            <div
              key={r.token}
              className={`rounded-lg border border-taupe/20 bg-[#FFFDF9] p-4 text-[14px] text-espresso ${
                cancelled || past ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="m-0 font-semibold capitalize">
                  {dateLabel} · {r.time}
                </p>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[1px] text-taupe">
                  {cancelled ? "Cancelada" : past ? "Concluída" : "Confirmada"}
                </span>
              </div>
              <p className="m-0 text-taupe">
                {r.name} · {r.people} {r.people === 1 ? "pessoa" : "pessoas"} ·{" "}
                {r.environmentName}
              </p>
              {!cancelled && !r.locked && (
                <Link
                  href={`/reservas/cancelar/${r.token}`}
                  className="mt-2 inline-block text-[13px] font-semibold text-dark-wine underline underline-offset-2"
                >
                  Cancelar reserva
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {rows && rows.length === 0 && (
        <p className="text-[13.5px] leading-relaxed text-taupe">
          Não encontramos reservas com esse nome e WhatsApp. Confira os dados, usando o mesmo
          nome e número da reserva.
        </p>
      )}

      <Link
        href="/reservas"
        className="mt-6 block rounded-md border border-dark-wine py-3.5 text-center font-sans text-[14.5px] font-semibold text-dark-wine"
      >
        Fazer uma reserva
      </Link>
    </div>
  );
}
