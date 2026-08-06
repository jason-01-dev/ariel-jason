import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseTags, requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  icon: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const raw = await request.json();
    const data = schema.parse(raw);
    const update: Record<string, unknown> = { ...data };
    if (data.tags !== undefined) update.tags = parseTags(data.tags);
    return NextResponse.json(await prisma.skillBlock.update({ where: { id }, data: update }));
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
    await prisma.skillBlock.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
