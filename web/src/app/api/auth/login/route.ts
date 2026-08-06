import { NextResponse } from "next/server";
import { authenticateOwner, COOKIE_NAME, signAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");

    if (!username || !password) {
      return NextResponse.json({ error: "Identifiants requis." }, { status: 400 });
    }

    const result = await authenticateOwner(username, password);
    if (!result.ok) {
      return NextResponse.json({ error: "Identifiant ou mot de passe incorrect." }, { status: 401 });
    }

    const token = signAdminToken(result.username);
    const res = NextResponse.json({
      ok: true,
      username: result.username,
      displayName: result.displayName,
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Connexion impossible (base de données ?)." },
      { status: 500 }
    );
  }
}
