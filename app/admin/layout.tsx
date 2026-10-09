// O marcador .admin-theme ativa a paleta da landing (ver globals.css). O CSS usa
// body:has(.admin-theme) para que dialogs/sheets/toasts (portais no <body>) herdem as cores.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-theme">{children}</div>;
}
