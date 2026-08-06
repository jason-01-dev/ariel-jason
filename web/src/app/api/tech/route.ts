import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { parseTags } from "@/lib/api-helpers";

const createSchema = z.object({
  category: z.string().min(1).max(80),
  title: z.string().min(2).max(200),
  description: z.string().min(2).max(2000),
  content: z.string().max(20000).optional(),
  imageUrl: z.string().optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  sourceUrl: z.string().max(500).optional().nullable(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().or(z.string().optional()),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    const admin = await isAdminAuthenticated();
    const items = await prisma.techItem.findMany({
      where: admin ? undefined : { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Base de données indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();

    const item = await prisma.techItem.create({
      data: {
        category: data.category,
        title: data.title,
        description: data.description,
        content: data.content ?? "",
        imageUrl: data.imageUrl || null,
        source: data.source || null,
        sourceUrl: data.sourceUrl || null,
        tags: parseTags(data.tags),
        featured: data.featured ?? false,
        publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        origin: "manual",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
