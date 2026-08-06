import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");
    const displayName = String(body?.displayName ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const secret = String(body?.secret ?? "").trim();

    if (!username || !password || !secret) {
      return NextResponse.json({ error: "Tous les champs requis." }, { status: 400 });
    }

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Code de configuration invalide." }, { status: 401 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Cet administrateur existe déjà." }, { status: 400 });
    }

    await prisma.adminUser.create({
      data: {
        username,
        displayName: displayName || username,
        email: email || null,
        passwordHash: hashPassword(password),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible de créer le compte admin." }, { status: 500 });
  }
}
