import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { parseTags } from "@/lib/api-helpers";

const updateSchema = z.object({
  category: z.string().min(1).max(80).optional(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().min(2).max(2000).optional(),
  content: z.string().max(20000).optional(),
  imageUrl: z.string().optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  sourceUrl: z.string().max(500).optional().nullable(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const raw = await request.json();
    const data = updateSchema.parse(raw);
    const update: Record<string, unknown> = { ...data };
    if (data.tags !== undefined) update.tags = parseTags(data.tags);
    if (data.publishedAt !== undefined) {
      const d = new Date(data.publishedAt);
      update.publishedAt = Number.isNaN(d.getTime()) ? undefined : d;
    }
    if (data.imageUrl === "") update.imageUrl = null;

    const item = await prisma.techItem.update({ where: { id }, data: update });
    return NextResponse.json(item);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.techItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
