import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimálně 8 znaků"),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: parsed.data.name,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
