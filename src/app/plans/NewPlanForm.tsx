"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPlanForm() {
  const router = useRouter();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("CZK");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(year),
          month: Number(month),
          title: title || undefined,
          currency,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error ?? "Failed to create plan");
        return;
      }

      setTitle("");
      router.refresh(); // server component re-fetch
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}
    >
      <input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 10, minWidth: 220 }}
      />

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{ padding: 10, width: 110 }}
        min={2000}
        max={2100}
      />

      <input
        type="number"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        style={{ padding: 10, width: 80 }}
        min={1}
        max={12}
      />

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        style={{ padding: 10 }}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        style={{ padding: "10px 14px", fontWeight: 700 }}
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {err && (
        <div style={{ background: "#fee2e2", padding: 10, borderRadius: 8 }}>
          {err}
        </div>
      )}
    </form>
  );
}
