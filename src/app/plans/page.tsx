import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NewPlanForm from "./NewPlanForm";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { items: true },
  });

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
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Your plans</h1>
          <p style={{ opacity: 0.8 }}>Logged in as {session.user.email}</p>
        </div>
        <a
          href="/api/auth/signout?callbackUrl=/login"
          style={{ textDecoration: "underline" }}
        >
          Logout
        </a>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Create new plan</h2>
        <NewPlanForm />
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Existing plans</h2>

        {plans.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No plans yet. Create one above.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginTop: 12,
              display: "grid",
              gap: 10,
            }}
          >
            {plans.map((p) => {
              const sumCents = p.items.reduce(
                (acc, it) => acc + it.amountCents,
                0
              );
              const sum = (sumCents / 100).toFixed(2);

              return (
                <li
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 14,
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
                      <a
                        href={`/plans/${p.id}`}
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          textDecoration: "underline",
                        }}
                      >
                        {p.title}
                      </a>
                      <div style={{ opacity: 0.8 }}>
                        {p.month}.{p.year} • {p.currency} • items:{" "}
                        {p.items.length}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800 }}>
                      {sum} {p.currency}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
