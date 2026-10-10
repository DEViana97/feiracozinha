"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminMobileNav({ reservationsEnabled = true }: { reservationsEnabled?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu administrativo</SheetTitle>
          <div onClick={() => setOpen(false)}>
            <AdminNav reservationsEnabled={reservationsEnabled} />
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-serif text-lg text-foreground">Feira</span>
    </div>
  );
}
