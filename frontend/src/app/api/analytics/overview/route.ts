import { NextResponse } from "next/server";
import { getOverview } from "@/lib/server-state";

export const dynamic = "force-static";

export async function GET() {
  const overview = getOverview();
  return NextResponse.json(overview);
}
