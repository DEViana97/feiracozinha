import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-serif text-3xl text-foreground">Feira</h1>
          <p className="text-sm text-muted-foreground">Painel administrativo</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
