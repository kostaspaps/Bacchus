"use client";
import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb) {
      setState("error");
      setMsg("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
      return;
    }
    setState("sending");
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`, shouldCreateUser: true },
    });
    if (error) {
      setState("error");
      setMsg(error.message);
    } else {
      setState("sent");
    }
  }

  return (
    <div className="max-w-[420px] mx-auto py-16">
      <p className="label text-olive m-0 mb-2">Bacchus · admin</p>
      <h1 className="font-serif text-3xl m-0 mb-6">Sign in</h1>
      {state === "sent" ? (
        <p className="text-sm text-ink">Check your inbox — we sent a magic link to <strong>{email}</strong>.</p>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2 text-[11px] tracking-[.18em] uppercase text-olive">
            Owner email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field tracking-normal normal-case" placeholder="you@bacchus.gr" />
          </label>
          <button disabled={state === "sending"} className="btn bg-wine text-ivory p-4 disabled:opacity-60">
            {state === "sending" ? "Sending…" : "Send magic link"}
          </button>
          {state === "error" && <p className="text-sm text-terracotta m-0">{msg}</p>}
          <p className="text-xs text-olive m-0">Only emails listed in ADMIN_EMAILS can access the admin.</p>
        </form>
      )}
    </div>
  );
}
