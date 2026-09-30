import { isAdminConfigured } from "@/lib/admin-session";
import { signIn } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="max-w-[420px] mx-auto py-16">
      <p className="label text-olive m-0 mb-2">Bacchus · admin</p>
      <h1 className="font-serif text-3xl m-0 mb-6">Sign in</h1>
      {!isAdminConfigured() ? (
        <p className="text-sm text-ink">
          Set <code>ADMIN_PASSWORD</code> in the Vercel project environment variables to enable the admin.
        </p>
      ) : (
        <form action={signIn} className="grid gap-4">
          <label className="grid gap-2 text-[11px] tracking-[.18em] uppercase text-olive">
            Owner password
            <input type="password" name="password" required autoComplete="current-password" className="field tracking-normal normal-case" />
          </label>
          <button className="btn bg-wine text-ivory p-4">Sign in</button>
          {error && (
            <p className="text-sm text-terracotta m-0" role="alert">
              Wrong password.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
