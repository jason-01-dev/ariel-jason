import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const createSchema = z.object({
  authorName: z.string().min(2).max(120),
  authorRole: z.string().min(2).max(120),
  company: z.string().max(120).optional().nullable(),
  content: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  try {
    const admin = await isAdminAuthenticated();
    const items = await prisma.testimonial.findMany({
      where: admin ? undefined : { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
    const item = await prisma.testimonial.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
