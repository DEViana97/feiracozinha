"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvironmentManager } from "@/components/admin/environment-manager";
import { ReservationList } from "@/components/admin/reservation-list";
import type { ComponentProps } from "react";

export function ReservationsTabs({
  environments,
  reservations,
}: {
  environments: ComponentProps<typeof EnvironmentManager>["environments"];
  reservations: ComponentProps<typeof ReservationList>["reservations"];
}) {
  return (
    <Tabs defaultValue="environments">
      <TabsList>
        <TabsTrigger value="environments">Ambientes</TabsTrigger>
        <TabsTrigger value="reservations">Reservas</TabsTrigger>
      </TabsList>
      <TabsContent value="environments" className="pt-4">
        <EnvironmentManager environments={environments} />
      </TabsContent>
      <TabsContent value="reservations" className="pt-4">
        <ReservationList reservations={reservations} />
      </TabsContent>
    </Tabs>
  );
}
