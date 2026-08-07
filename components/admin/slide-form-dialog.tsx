"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { slideSchema, type SlideInput } from "@/lib/validations/slide";
import { createSlide, updateSlide } from "@/lib/actions/slide";

type EditingSlide = {
  id: string;
  imageUrl: string;
  caption: string;
  active: boolean;
} | null;

export function SlideFormDialog({
  open,
  onOpenChange,
  slide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: EditingSlide;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SlideInput>({
    resolver: zodResolver(slideSchema),
    defaultValues: { imageUrl: "", caption: "", active: true },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        imageUrl: slide?.imageUrl ?? "",
        caption: slide?.caption ?? "",
        active: slide?.active ?? true,
      });
    }
  }, [open, slide, form]);

  function onSubmit(values: SlideInput) {
    startTransition(async () => {
      try {
        if (slide) {
          await updateSlide(slide.id, values);
          toast.success("Foto atualizada.");
        } else {
          await createSlide(values);
          toast.success("Foto adicionada.");
        }
        onOpenChange(false);
      } catch {
        toast.error("Não foi possível salvar a foto.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{slide ? "Editar foto" : "Nova foto"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <ImageUploadField value={field.value} onChange={(url) => field.onChange(url ?? "")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legenda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Direto da feira" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel>Foto ativa</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
