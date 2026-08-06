"use client";

import { useState } from "react";
import { Menu, MapPin, Phone, Mail, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { RestaurantInfo } from "@prisma/client";

export function RestaurantDrawer({ info }: { info: RestaurantInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer swipeDirection="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Abrir menu">
            <Menu className="size-5" />
          </Button>
        }
      />
      <DrawerContent className="h-full w-80 max-w-[85vw]">
        <DrawerHeader className="text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rotate-45 bg-primary" />
            <DrawerTitle className="font-serif text-3xl tracking-wide">
              FEIRA
            </DrawerTitle>
          </div>
          <p className="font-serif italic text-muted-foreground pt-1">
            {info.tagline}
          </p>
        </DrawerHeader>

        <div className="px-4 space-y-6 overflow-y-auto">
          {info.drawerText && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {info.drawerText}
            </p>
          )}

          <div className="space-y-3 text-sm">
            {info.address && (
              <div className="flex gap-2 items-start">
                <MapPin className="size-4 mt-0.5 shrink-0 text-primary" />
                <span>{info.address}</span>
              </div>
            )}
            {info.phone && (
              <a
                href={`tel:${info.phone.replace(/\D/g, "")}`}
                className="flex gap-2 items-start hover:text-primary"
              >
                <Phone className="size-4 mt-0.5 shrink-0 text-primary" />
                <span>{info.phone}</span>
              </a>
            )}
            {info.email && (
              <a
                href={`mailto:${info.email}`}
                className="flex gap-2 items-start hover:text-primary"
              >
                <Mail className="size-4 mt-0.5 shrink-0 text-primary" />
                <span>{info.email}</span>
              </a>
            )}
            {info.instagram && (
              <a
                href={`https://instagram.com/${info.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-start hover:text-primary"
              >
                <AtSign className="size-4 mt-0.5 shrink-0 text-primary" />
                <span>{info.instagram}</span>
              </a>
            )}
          </div>
        </div>

        <DrawerClose
          render={
            <Button variant="outline" className="m-4 mt-6">
              Fechar
            </Button>
          }
        />
      </DrawerContent>
    </Drawer>
  );
}
