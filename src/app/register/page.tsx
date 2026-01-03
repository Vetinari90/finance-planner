"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error ?? "Registration failed");
        return;
      }

      // auto-login
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        setErr("Registered, but login failed. Try logging in.");
        router.push("/login");
        return;
      }

      router.push("/plans");
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Register</h1>
      <p style={{ opacity: 0.8 }}>Create an account for your own plans.</p>

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
          Name (optional)
          <input
            style={{ width: "100%", padding: 10, marginTop: 4 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
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
            minLength={8}
            autoComplete="new-password"
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
          {loading ? "Creating..." : "Create account"}
        </button>

        <a href="/login" style={{ textDecoration: "underline" }}>
          I already have an account
        </a>
      </form>
    </main>
  );
}
