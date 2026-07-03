"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { adminLogin } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError("");
    const res = await adminLogin(null, formData);
    setPending(false);
    if (res.ok) router.push("/admin");
    else setError(res.error ?? "Login failed.");
  }

  return (
    <div className="container-wide grid min-h-screen place-items-center">
      <form action={action} className="w-full max-w-sm rounded-3xl border border-black/10 bg-ink-800 p-8">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
          <Lock size={22} />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-center text-sm text-black/55">Enter the admin password to continue.</p>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoFocus
          className="mt-6 w-full rounded-xl border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red"
        />
        {error && <p className="mt-2 text-sm text-brand-red">{error}</p>}
        <Button type="submit" size="lg" disabled={pending} className="mt-4 w-full">
          {pending ? "Checking…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
