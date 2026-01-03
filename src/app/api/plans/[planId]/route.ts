import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/requireUser";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ planId: string }> }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await ctx.params;

  const plan = await prisma.plan.findFirst({
    where: { id: planId, userId },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ plan });
}

export async function DELETE(
  _req: Request,
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

  await prisma.plan.delete({ where: { id: planId } });
  return NextResponse.json({ ok: true });
}
