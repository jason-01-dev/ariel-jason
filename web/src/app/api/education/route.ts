import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  title: z.string().min(2),
  school: z.string().min(1),
  description: z.string().min(2),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const items = await prisma.educationItem.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "DB indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const data = schema.parse(await request.json());
    const item = await prisma.educationItem.create({
      data: {
        ...data,
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
