import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "./auth";

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  return null;
}

export function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String).map((t) => t.trim()).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}
