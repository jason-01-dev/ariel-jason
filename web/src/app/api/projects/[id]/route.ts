import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseTags, requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  linkLabel: z.string().optional(),
  linkUrl: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  showImage: z.boolean().optional(),
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
    if (data.imageUrl === "") update.imageUrl = null;
    return NextResponse.json(await prisma.project.update({ where: { id }, data: update }));
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
