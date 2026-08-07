"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type FormState = {
  date: string;
  time: string;
  people: string;
  name: string;
  contact: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  date: "",
  time: "",
  people: "2",
  name: "",
  contact: "",
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

  if (!form.name.trim()) errors.name = "Informe seu nome.";

  if (!form.contact.trim()) {
    errors.contact = "Informe um contato.";
  } else {
    const digits = form.contact.replace(/\D/g, "");
    if (digits.length < 10) errors.contact = "Informe um WhatsApp válido com DDD.";
  }

  return errors;
}

function fieldClass(hasError: boolean) {
  return `w-full rounded-md border ${
    hasError ? "border-[#8b3a2e]" : "border-iron-grey/30"
  } bg-[#FFFDF9] px-3 py-[11px] font-sans text-sm text-[#3B2A26] outline-none focus:border-dark-wine focus:ring-1 focus:ring-dark-wine`;
}

// NOTA DE INTEGRAÇÃO: o submit abaixo está com um placeholder local
// (setSubmitted). Trocar `handleSubmit` para chamar a Server Action real de
// criação de reserva do projeto (algo como `createReservation` em
// `lib/actions/reservation.ts`), seguindo o mesmo padrão de Server Actions
// já usado no admin (categoria/item/tag). O modelo de dados sugerido está
// documentado no guia de reservas que já entregamos antes.
export function ReservationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit() {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      // TODO: substituir por chamada real à Server Action de reserva.
      // await createReservation(form);
      const dateFmt = new Date(`${form.date}T00:00:00`).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      });
      const people = Number(form.people);
      setSummary(
        `${form.name}, sua mesa para ${form.people} pessoa${people > 1 ? "s" : ""} está confirmada em ${dateFmt} às ${form.time}.`
      );
      setSubmitted(true);
    });
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return <ReservationConfirmation summary={summary} onReset={resetForm} />;
  }

  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <h1 className="m-0 mb-1.5 font-serif text-[26px] text-espresso">
        Reservar uma mesa
      </h1>
      <p className="mb-6 text-[13.5px] leading-relaxed text-taupe">
        Preencha os dados abaixo e confirmamos sua mesa na Feira.
      </p>

      <div className="flex flex-col gap-4">
        <Field label="Data" error={errors.date}>
          <input
            type="date"
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
  onReset,
}: {
  summary: string;
  onReset: () => void;
}) {
  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <div className="relative overflow-hidden rounded-lg bg-dark-wine px-6 py-9 text-center">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('/images/cobogo.png')",
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}
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
          <p className="mb-[22px] text-[12.5px] text-[#F1DFC9]">
            Enviamos a confirmação para o contato informado.
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
