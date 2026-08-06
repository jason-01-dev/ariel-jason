import { NextResponse } from "next/server";

/**
 * RSS désactivé : les actualités sont uniquement manuelles (contenu propriétaire).
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      disabled: true,
      message:
        "L'import RSS est désactivé. Publie tes propres articles depuis l'admin → Actualités.",
      imported: 0,
      skipped: 0,
      errors: [],
      feeds: [],
    },
    { status: 410 }
  );
}

export async function GET() {
  return POST();
}
