import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground">
      <span className="inline-block size-2 rotate-45 bg-primary" />
      <h1 className="font-serif text-3xl">Página não encontrada</h1>
      <p className="text-muted-foreground">
        Este item pode ter saído do cardápio.
      </p>
      <Link href="/" className="mt-2 text-primary underline underline-offset-4">
        Voltar ao cardápio
      </Link>
    </div>
  );
}
