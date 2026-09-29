"use client";

import { useState } from "react";

export type ExportItem = {
  title: string;
  note: string | null;
  amountCents: number;
};

/** RFC 4180: wrap in quotes and double any quote inside. */
function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv(
  planTitle: string,
  currency: string,
  items: ExportItem[],
): string {
  const rows = [
    ["Title", "Note", `Amount (${currency})`].map(csvCell).join(","),
    ...items.map((it) =>
      [
        csvCell(it.title),
        csvCell(it.note ?? ""),
        csvCell((it.amountCents / 100).toFixed(2)),
      ].join(","),
    ),
  ];

  const totalCents = items.reduce((acc, it) => acc + it.amountCents, 0);
  rows.push(
    [csvCell("Total"), csvCell(""), csvCell((totalCents / 100).toFixed(2))].join(
      ",",
    ),
  );

  // A BOM keeps Excel from mangling non-ASCII titles.
  return "﻿" + rows.join("\r\n") + "\r\n";
}

/** Filesystem-safe slug, so a plan called "Dovolená / 2026" still downloads. */
function fileNameFor(planTitle: string): string {
  const slug =
    planTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "plan";
  return `${slug}.csv`;
}

export default function ExportCsvButton({
  planTitle,
  currency,
  items,
}: {
  planTitle: string;
  currency: string;
  items: ExportItem[];
}) {
  const [done, setDone] = useState(false);
  const disabled = items.length === 0;

  function onExport() {
    const blob = new Blob([buildCsv(planTitle, currency, items)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameFor(planTitle);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      onClick={onExport}
      disabled={disabled}
      title={
        disabled ? "Add an item first" : "Download these items as a CSV file"
      }
      style={{
        marginTop: 10,
        marginRight: 8,
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {done ? "Exported ✓" : "Export CSV"}
    </button>
  );
}
