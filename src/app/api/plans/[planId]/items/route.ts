import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/requireUser";
import { z } from "zod";

const CreateItemSchema = z.object({
  title: z.string().min(1).max(120),
  amountCents: z.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  note: z.string().max(400).optional().nullable(),
});

export async function POST(
  req: Request,
  ctx: { params: Promise<{ planId: string }> }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await ctx.params;

  const plan = await prisma.plan.findFirst({
    where: { id: planId, userId },
    select: { id: true },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await prisma.plannedItem.create({
    data: {
      planId,
      title: parsed.data.title,
      amountCents: parsed.data.amountCents,
      categoryId: parsed.data.categoryId ?? null,
      note: parsed.data.note ?? null,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
