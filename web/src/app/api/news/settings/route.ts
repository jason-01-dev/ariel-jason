import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-helpers";

/** RSS désactivé — pas de sources externes */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({
    newsAutoSync: false,
    newsLastSyncAt: null,
    newsSyncIntervalHours: 6,
    feeds: [],
    mode: "manual_only",
    message: "Seuls tes articles (admin) sont affichés. Pas d'import externe.",
  });
}

export async function PUT() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({
    newsAutoSync: false,
    newsLastSyncAt: null,
    newsSyncIntervalHours: 6,
    message: "Import automatique désactivé définitivement.",
  });
}
