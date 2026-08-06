import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const displayName =
      typeof body?.displayName === "string" ? body.displayName.trim() : undefined;
    const email =
      body?.email === null || body?.email === ""
        ? null
        : typeof body?.email === "string"
          ? body.email.trim()
          : undefined;

    const user = await prisma.adminUser.update({
      where: { username: session.username },
      data: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(email !== undefined ? { email } : {}),
      },
    });

    return NextResponse.json({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    });
  } catch {
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}
