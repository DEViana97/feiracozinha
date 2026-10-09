"use client";

import { useSyncExternalStore } from "react";

// Só o nome/WhatsApp usados na última reserva ficam no aparelho, para preencher
// formulários. As reservas em si são buscadas no servidor por nome + WhatsApp.
const CONTACT_KEY = "feira:contact";
const EVENT = "feira:storage";

export type SavedContact = { name: string; contact: string };

function read(): string {
  try {
    return localStorage.getItem(CONTACT_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

// O snapshot é uma string (estável); o parse acontece fora do getSnapshot.
export function useSavedContact(): SavedContact | null {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  try {
    const c = raw ? (JSON.parse(raw) as Partial<SavedContact>) : null;
    return c?.name && c?.contact ? { name: c.name, contact: c.contact } : null;
  } catch {
    return null;
  }
}

export function saveContact(contact: SavedContact) {
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(contact));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // storage bloqueado (aba anônima etc.): segue sem salvar.
  }
}
