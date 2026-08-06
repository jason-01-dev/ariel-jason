import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseTags, requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  linkLabel: z.string().optional(),
  linkUrl: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  showImage: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await prisma.project.findMany({ orderBy: { sortOrder: "asc" } }));
  } catch {
    return NextResponse.json({ error: "DB indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const raw = await request.json();
    const data = schema.parse(raw);
    const item = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        tags: parseTags(data.tags),
        linkLabel: data.linkLabel ?? "Voir le projet",
        linkUrl: data.linkUrl ?? "#",
        imageUrl: data.imageUrl || null,
        showImage: data.showImage ?? true,
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
