"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = confirm("Delete this plan? This cannot be undone.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/plans/${planId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/plans");
        router.refresh();
      } else {
        alert("Delete failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      style={{
        marginTop: 10,
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: 10,
        cursor: "pointer",
      }}
    >
      {loading ? "Deleting..." : "Delete plan"}
    </button>
  );
}
