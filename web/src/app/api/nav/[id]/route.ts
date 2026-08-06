import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  label: z.string().min(1).optional(),
  href: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const data = schema.parse(await request.json());
    return NextResponse.json(await prisma.navLink.update({ where: { id }, data }));
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    await prisma.navLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
