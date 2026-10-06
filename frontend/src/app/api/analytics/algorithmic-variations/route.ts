import { NextResponse } from "next/server";
import { getAllVariations } from "@/lib/server-state";

export const dynamic = "force-static";

export async function GET() {
  const variations = getAllVariations();
  return NextResponse.json(variations);
}
