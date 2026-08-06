import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const newPassword = String(body?.newPassword ?? "");
    const secret = String(body?.secret ?? "").trim();

    if (!username || !newPassword || !secret) {
      return NextResponse.json({ error: "Tous les champs requis." }, { status: 400 });
    }

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Code de récupération invalide." }, { status: 401 });
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible de réinitialiser le mot de passe." }, { status: 500 });
  }
}
