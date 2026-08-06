import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "main" } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "DB indisponible." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    // Ne pas écraser id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, updatedAt: _u, ...data } = body;

    if (typeof data.aboutExcellenceItems === "string") {
      data.aboutExcellenceItems = data.aboutExcellenceItems
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main", ...data },
      update: data,
    });
    return NextResponse.json(settings);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sauvegarde impossible." }, { status: 500 });
  }
}
