"use client";
import { useRef, useState } from "react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  async function logout() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const csrf = await fetch("/api/auth/csrf", { cache: "no-store" });
      if (!csrf.ok) throw new Error();
      const { csrfToken } = await csrf.json();
      if (typeof csrfToken !== "string" || !csrfToken) throw new Error();
      const response = await fetch("/api/auth/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: "{}",
      });
      if (!response.ok) throw new Error();
      window.location.replace("/connexion");
    } catch {
      pending.current = false;
      setBusy(false);
      setError("Déconnexion non confirmée. Réessayez avant de quitter cet appareil.");
    }
  }

  return <div className="crm-logout-control">
    <button className="crm-logout" type="button" onClick={logout} disabled={busy}
      aria-busy={busy} title="Se déconnecter">
      {busy ? "Déconnexion…" : "Se déconnecter"}
    </button>
    {error && <p className="crm-logout-error" role="alert">{error}</p>}
  </div>;
}
