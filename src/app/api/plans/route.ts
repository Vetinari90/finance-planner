import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/requireUser";
import { z } from "zod";

const CreatePlanSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  currency: z.string().min(3).max(3).default("CZK"),
});

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = CreatePlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { year, month, currency } = parsed.data;
  const title = parsed.data.title ?? `${month}.${year}`;

  try {
    const plan = await prisma.plan.create({
      data: { userId, year, month, currency, title },
    });
    return NextResponse.json({ plan }, { status: 201 });
  } catch (e: any) {
    // unikát (userId, year, month)
    return NextResponse.json(
      { error: "Plan for this month already exists" },
      { status: 409 }
    );
  }
}
