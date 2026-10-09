"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  checkAvailability,
  createReservation,
  type EnvironmentAvailability,
} from "@/lib/actions/reservation";
import { saveContact, useSavedContact } from "@/lib/my-reservations";

type FormState = {
  date: string;
  time: string;
  people: string;
  name: string;
  contact: string;
  environmentId: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  date: "",
  time: "",
  people: "2",
  name: "",
  contact: "",
  environmentId: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.date) {
    errors.date = "Escolha uma data.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${form.date}T00:00:00`);
    if (chosen < today) errors.date = "A data não pode ser no passado.";
  }

  if (!form.time) errors.time = "Escolha um horário.";

  const people = parseInt(form.people, 10);
  if (!people || people < 1 || people > 20) {
    errors.people = "Informe entre 1 e 20 pessoas.";
  }

  if (!form.environmentId) errors.environmentId = "Escolha um ambiente.";

  if (!form.name.trim()) errors.name = "Informe seu nome.";

  if (!form.contact.trim()) {
    errors.contact = "Informe um contato.";
  } else {
    const digits = form.contact.replace(/\D/g, "");
    if (digits.length < 10) errors.contact = "Informe um WhatsApp válido com DDD.";
  }

  return errors;
}

function todayLocal() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fieldClass(hasError: boolean) {
  return `w-full rounded-md border ${
    hasError ? "border-[#8b3a2e]" : "border-iron-grey/30"
  } bg-[#FFFDF9] px-3 py-[11px] font-sans text-sm text-[#3B2A26] outline-none focus:border-dark-wine focus:ring-1 focus:ring-dark-wine`;
}

export function ReservationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [cancelToken, setCancelToken] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [options, setOptions] = useState<EnvironmentAvailability[] | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const saved = useSavedContact();

  const peopleNumber = parseInt(form.people, 10);
  const canCheck =
    !!form.date && !!form.time && peopleNumber >= 1 && peopleNumber <= 20;

  // Consulta quais ambientes ainda têm mesa para data/horário/pessoas escolhidos.
  useEffect(() => {
    if (!canCheck) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoadingOptions(true);
      try {
        const result = await checkAvailability({
          date: form.date,
          time: form.time,
          people: peopleNumber,
        });
        if (cancelled) return;
        setOptions(result);
        setForm((f) =>
          result.some((o) => o.id === f.environmentId && o.available)
            ? f
            : { ...f, environmentId: "" }
        );
      } catch {
        if (!cancelled) setOptions(null);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [canCheck, form.date, form.time, peopleNumber]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSubmitError("");
  }

  function handleSubmit() {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      try {
        const result = await createReservation({
          environmentId: form.environmentId,
          date: form.date,
          time: form.time,
          people: peopleNumber,
          name: form.name,
          contact: form.contact,
        });
        if (result.ok) {
          setSummary(result.summary);
          setCancelToken(result.cancelToken);
          saveContact({ name: form.name.trim(), contact: form.contact.trim() });
          setSubmitted(true);
        } else {
          setSubmitError(result.error);
        }
      } catch {
        setSubmitError("Não foi possível concluir a reserva. Tente novamente.");
      }
    });
  }

  function resetForm() {
    setForm(initialForm);
    setOptions(null);
    setSubmitError("");
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <ReservationConfirmation
        summary={summary}
        cancelToken={cancelToken}
        onReset={resetForm}
      />
    );
  }

  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <h1 className="m-0 font-serif text-[26px] text-espresso">Reservar uma mesa</h1>
        <Link
          href="/reservas/minhas"
          className="shrink-0 text-[13px] font-semibold text-dark-wine underline underline-offset-2"
        >
          Minhas reservas
        </Link>
      </div>
      <p className="mb-6 text-[13.5px] leading-relaxed text-taupe">
        Preencha os dados abaixo e confirmamos sua mesa na Feira.
      </p>

      <div className="flex flex-col gap-4">
        <Field label="Data" error={errors.date}>
          <input
            type="date"
            min={todayLocal()}
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className={fieldClass(!!errors.date)}
          />
        </Field>

        <div className="flex gap-3">
          <Field label="Horário" error={errors.time} className="flex-1">
            <input
              type="time"
              value={form.time}
              onChange={(e) => updateField("time", e.target.value)}
              className={fieldClass(!!errors.time)}
            />
          </Field>
          <Field label="Pessoas" error={errors.people} className="flex-1">
            <input
              type="number"
              min={1}
              max={20}
              value={form.people}
              onChange={(e) => updateField("people", e.target.value)}
              className={fieldClass(!!errors.people)}
            />
          </Field>
        </div>

        <Field label="Ambiente" error={errors.environmentId}>
          {!canCheck ? (
            <p className="text-[13px] text-taupe">
              Escolha data, horário e pessoas para ver os ambientes disponíveis.
            </p>
          ) : loadingOptions && !options ? (
            <p className="text-[13px] text-taupe">Verificando disponibilidade...</p>
          ) : options && options.length > 0 ? (
            <div className="flex flex-col gap-2">
              {options.map((o) => {
                const selected = form.environmentId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={!o.available}
                    onClick={() => updateField("environmentId", o.id)}
                    className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-dark-wine bg-dark-wine/5 ring-1 ring-dark-wine"
                        : "border-iron-grey/30 bg-[#FFFDF9]"
                    } ${o.available ? "" : "cursor-not-allowed opacity-50"}`}
                  >
                    <span className="block font-sans text-sm font-semibold text-[#3B2A26]">
                      {o.name}
                    </span>
                    <span className="block text-[12.5px] text-taupe">
                      {o.available
                        ? (o.description ?? "Mesa disponível")
                        : "Sem mesas para esse horário"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-taupe">
              Nenhum ambiente aceitando reservas no momento.
            </p>
          )}
        </Field>

        {saved && !form.name && !form.contact && (
          <button
            type="button"
            onClick={() => {
              updateField("name", saved.name);
              updateField("contact", saved.contact);
            }}
            className="rounded-md border border-dark-wine/40 bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-dark-wine"
          >
            Usar meus dados salvos ({saved.name})
          </button>
        )}

        <Field label="Nome" error={errors.name}>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={fieldClass(!!errors.name)}
          />
        </Field>

        <Field label="Contato (WhatsApp)" error={errors.contact}>
          <input
            type="text"
            placeholder="(85) 99999-0000"
            value={form.contact}
            onChange={(e) => updateField("contact", e.target.value)}
            className={fieldClass(!!errors.contact)}
          />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="mt-2 rounded-md bg-dark-wine py-3.5 font-sans text-[14.5px] font-semibold text-floral-white disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Confirmar reserva"}
        </button>
        {submitError && (
          <span className="text-center text-xs text-[#8b3a2e]">{submitError}</span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[1px] text-iron-grey">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-[#8b3a2e]">{error}</span>}
    </div>
  );
}

function ReservationConfirmation({
  summary,
  cancelToken,
  onReset,
}: {
  summary: string;
  cancelToken: string;
  onReset: () => void;
}) {
  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <div className="relative overflow-hidden rounded-lg bg-dark-wine px-6 py-9 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cobogo-wine.jpg')" }}
        />
        <div className="relative">
          <span
            aria-hidden
            className="mb-3.5 inline-block h-6 w-3 bg-floral-white"
            style={{
              WebkitMaskImage: "url('/images/cobogo-mark.png')",
              maskImage: "url('/images/cobogo-mark.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <h1 className="m-0 mb-2 font-serif text-[22px] text-floral-white">
            Mesa reservada
          </h1>
          <p className="mb-5 text-[13.5px] leading-relaxed text-[#F1DFC9]">
            {summary}
          </p>
          <p className="mb-3 text-[12.5px] text-[#F1DFC9]">
            Nossa equipe foi avisada da sua reserva. Até breve!
          </p>
          <p className="mb-[22px] text-[12.5px] text-[#F1DFC9]">
            Veja suas reservas em{" "}
            <Link
              href="/reservas/minhas"
              className="font-semibold underline underline-offset-2"
            >
              Minhas reservas
            </Link>
            . Precisa desmarcar?{" "}
            <Link
              href={`/reservas/cancelar/${cancelToken}`}
              className="font-semibold underline underline-offset-2"
            >
              Cancelar esta reserva
            </Link>
            . Guarde este link.
          </p>
          <div className="flex justify-center gap-2.5">
            <button
              onClick={onReset}
              className="rounded-md border border-floral-white bg-transparent px-4 py-2.5 text-[13px] font-semibold text-floral-white"
            >
              Nova reserva
            </button>
            <Link
              href="/cardapio"
              className="rounded-md bg-floral-white px-4 py-2.5 text-[13px] font-semibold text-dark-wine"
            >
              Ver cardápio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
