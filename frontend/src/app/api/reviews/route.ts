import { NextResponse } from "next/server";
import { getStoredReviews } from "@/lib/server-state";

export const dynamic = "force-static";

export async function GET() {
  const reviews = getStoredReviews();
  const counts = {
    total: reviews.length,
    positive: reviews.filter((r) => r.sentiment === "Positive").length,
    neutral: reviews.filter((r) => r.sentiment === "Neutral").length,
    negative: reviews.filter((r) => r.sentiment === "Negative").length,
  };

  return NextResponse.json({
    summary: counts,
    reviews,
  });
}
