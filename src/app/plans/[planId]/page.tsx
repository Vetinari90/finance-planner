import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AddItemForm from "./AddItemForm";
import DeletePlanButton from "./DeletePlanButton";

export default async function PlanDetailPage({
  params,
}: {
  params: { planId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const plan = await prisma.plan.findFirst({
    where: { id: params.planId, userId },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!plan) notFound();

  const totalCents = plan.items.reduce((acc, it) => acc + it.amountCents, 0);
  const total = (totalCents / 100).toFixed(2);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <a href="/plans" style={{ textDecoration: "underline" }}>
            ← Back to plans
          </a>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>
            {plan.title}
          </h1>
          <div style={{ opacity: 0.8 }}>
            {plan.month}.{plan.year} • {plan.currency}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>
            {total} {plan.currency}
          </div>
          <DeletePlanButton planId={plan.id} />
        </div>
      </div>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Add item</h2>
        <AddItemForm planId={plan.id} currency={plan.currency} />
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Items</h2>

        {plan.items.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No items yet.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginTop: 12,
              display: "grid",
              gap: 8,
            }}
          >
            {plan.items.map((it) => (
              <li
                key={it.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{it.title}</div>
                    {it.note ? (
                      <div style={{ opacity: 0.8 }}>{it.note}</div>
                    ) : null}
                  </div>
                  <div style={{ fontWeight: 900 }}>
                    {(it.amountCents / 100).toFixed(2)} {plan.currency}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
