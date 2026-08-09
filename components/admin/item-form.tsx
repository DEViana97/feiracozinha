"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
// useFieldArray: usado pelo campo de variações (temporariamente desativado)
// import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// Plus, Trash2: usados pelo campo de variações (temporariamente desativado)
// import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
// Tags temporariamente desativado — ver nota em AGENTS.md.
// import { getTagIcon } from "@/lib/tag-icons";
// import { cn } from "@/lib/utils";
import { menuItemSchema, type MenuItemInput } from "@/lib/validations/item";
import { createMenuItem, updateMenuItem } from "@/lib/actions/item";

type CategoryOption = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};
// Tags temporariamente desativado — ver nota em AGENTS.md.
type TagOption = { id: string; name: string; icon: string };

export function ItemForm({
  categories,
  // tags,
  defaultValues,
  itemId,
}: {
  categories: CategoryOption[];
  tags?: TagOption[];
  defaultValues?: MenuItemInput;
  itemId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      basePrice: "0",
      categoryId: categories[0]?.id ?? "",
      subcategoryId: null,
      imageUrl: null,
      featured: false,
      active: true,
      tagIds: [],
      variants: [],
    },
  });

  // Variações temporariamente desativado
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "variants",
  // });

  const categoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === categoryId);
  // const tagIds = form.watch("tagIds"); // Tags temporariamente desativado — ver nota em AGENTS.md.

  function onSubmit(values: MenuItemInput) {
    startTransition(async () => {
      try {
        if (itemId) {
          await updateMenuItem(itemId, values);
          toast.success("Item atualizado.");
        } else {
          await createMenuItem(values);
          toast.success("Item criado.");
        }
        router.push("/admin/items");
      } catch {
        toast.error("Não foi possível salvar o item.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Peixe do Dia na Folha de Bananeira" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço base (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    form.setValue("subcategoryId", null);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione">
                        {(value: string) => categories.find((c) => c.id === value)?.name}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedCategory && selectedCategory.subcategories.length > 0 && (
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategoria</FormLabel>
                <Select
                  value={field.value ?? "__none__"}
                  onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nenhuma">
                        {(value: string) =>
                          value === "__none__"
                            ? "Nenhuma"
                            : selectedCategory.subcategories.find((s) => s.id === value)?.name
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhuma</SelectItem>
                    {selectedCategory.subcategories.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <ImageUploadField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags temporariamente desativado — ver nota em AGENTS.md.
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const Icon = getTagIcon(tag.icon);
              const selected = tagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "tagIds",
                      selected ? tagIds.filter((id) => id !== tag.id) : [...tagIds, tag.id]
                    )
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <Icon className="size-3.5" />
                  {tag.name}
                </button>
              );
            })}
            {tags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma tag cadastrada ainda.
              </p>
            )}
          </div>
        </FormItem>
        */}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                <FormLabel>Destaque/novidade</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                <FormLabel>Item ativo</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Variações temporariamente desativado — ver nota em AGENTS.md.
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Variações (sabor/tamanho)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", description: "", price: "0", imageUrl: null })}
            >
              <Plus className="size-3.5" />
              Adicionar variação
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 rounded-lg border border-border p-3">
              <Input
                placeholder="Nome (ex.: 125ml)"
                {...form.register(`variants.${index}.name`)}
              />
              <Input
                placeholder="Descrição (opcional)"
                {...form.register(`variants.${index}.description`)}
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Preço"
                className="w-24"
                {...form.register(`variants.${index}.price`)}
              />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
        */}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar item"}
        </Button>
      </form>
    </Form>
  );
}
