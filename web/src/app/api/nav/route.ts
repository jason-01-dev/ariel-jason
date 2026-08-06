import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

const schema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await prisma.navLink.findMany({ orderBy: { sortOrder: "asc" } }));
  } catch {
    return NextResponse.json({ error: "DB indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const data = schema.parse(await request.json());
    const item = await prisma.navLink.create({
      data: {
        label: data.label,
        href: data.href,
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
