"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddItemForm({
  planId,
  currency,
}: {
  planId: string;
  currency: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(""); // v UI jako text/decimal
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toCents(value: string) {
    // jednoduchý převod: "123.45" -> 12345 (bez magických floatů)
    const normalized = value.replace(",", ".").trim();
    if (!normalized) return null;
    const m = normalized.match(/^(\d+)(\.(\d{1,2}))?$/);
    if (!m) return null;
    const whole = Number(m[1]);
    const frac = (m[3] ?? "").padEnd(2, "0");
    return whole * 100 + Number(frac);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const cents = toCents(amount);
    if (cents === null) {
      setErr(
        "Amount must be a number with max 2 decimals (e.g. 1200 or 1200.50)"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/plans/${planId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amountCents: cents,
          note: note || null,
          categoryId: null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error ?? "Failed to add item");
        return;
      }

      setTitle("");
      setAmount("");
      setNote("");
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "grid", gap: 10, marginTop: 10 }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, minWidth: 240 }}
          required
        />

        <input
          placeholder={`Amount (${currency})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 10, width: 160 }}
          required
        />
      </div>

      <textarea
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ padding: 10, minHeight: 70 }}
      />

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 14px", fontWeight: 800 }}
        >
          {loading ? "Adding..." : "Add item"}
        </button>
        {err && (
          <div style={{ background: "#fee2e2", padding: 10, borderRadius: 8 }}>
            {err}
          </div>
        )}
      </div>
    </form>
  );
}
