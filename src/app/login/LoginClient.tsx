"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/plans";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setErr("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Login</h1>
      <p style={{ opacity: 0.8 }}>Sign in to see your plans.</p>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, marginTop: 16 }}
      >
        <label>
          Email
          <input
            style={{ width: "100%", padding: 10, marginTop: 4 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            style={{ width: "100%", padding: 10, marginTop: 4 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {err && (
          <div style={{ background: "#fee2e2", padding: 10, borderRadius: 8 }}>
            {err}
          </div>
        )}

        <button
          disabled={loading}
          style={{ padding: 12, fontWeight: 600, cursor: "pointer" }}
          type="submit"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <a href="/register" style={{ textDecoration: "underline" }}>
          Create new account
        </a>
      </form>
    </main>
  );
}
