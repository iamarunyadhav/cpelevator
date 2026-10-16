import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/adminService";
export default function Auth() {
  usePageMeta(
    "Admin Sign In | Compass Elevators",
    "Private administrator access for Compass Elevators.",
    { noindex: true },
  );
  const nav = useNavigate();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const { error } = await authService.signIn(String(fd.get("email")), String(fd.get("password")));
    if (error) {
      setError("The email or password is incorrect, or this account is not enabled.");
      setBusy(false);
      return;
    }
    nav("/admin");
  }
  return (
    <main className="grid min-h-screen place-items-center bg-secondary p-4">
      <div className="w-full max-w-md border-t-4 border-accent bg-card p-8 shadow-xl">
        <Logo />
        <div className="mt-10 flex items-center gap-3">
          <LockKeyhole className="size-6 text-accent" />
          <h1 className="text-2xl font-bold">Administrator sign in</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Access is limited to approved Compass Elevators administrators.
        </p>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <div>
            <label className="field-label" htmlFor="email">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-field"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button className="w-full" size="lg" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
