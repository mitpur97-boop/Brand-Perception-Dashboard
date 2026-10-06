import { NextResponse } from "next/server";
import { getStoredReviews } from "@/lib/server-state";

export const dynamic = "force-static";

export async function GET() {
  const reviews = getStoredReviews();
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    total_reviews: reviews.length,
    model_loaded: true,
  });
}
