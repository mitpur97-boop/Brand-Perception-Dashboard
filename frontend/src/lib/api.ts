import {
  Review,
  OverviewAnalyticsResponse,
  AlgorithmicVariationsResponse,
  PredictResponse,
} from "./types";
import {
  getStoredReviews,
  getOverview,
  getAllVariations,
  addReviewToMemory,
  resetStoredReviews,
} from "./server-state";
import { classifyText } from "./ml-classifier";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchHealth(): Promise<{ status: string; total_reviews: number; model_loaded: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {}
  return {
    status: "healthy",
    total_reviews: getStoredReviews().length,
    model_loaded: true,
  };
}

export async function fetchOverviewAnalytics(): Promise<OverviewAnalyticsResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/analytics/overview`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {}
  return getOverview();
}

export async function fetchAlgorithmicVariations(): Promise<AlgorithmicVariationsResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/analytics/algorithmic-variations`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {}
  return getAllVariations();
}

export async function fetchReviews(params?: {
  sentiment?: string;
  is_verified?: boolean;
  channel?: string;
  search?: string;
  limit?: number;
}): Promise<{ summary: { total: number; positive: number; neutral: number; negative: number }; reviews: Review[] }> {
  try {
    const query = new URLSearchParams();
    if (params?.sentiment && params.sentiment !== "ALL") query.set("sentiment", params.sentiment);
    if (params?.is_verified !== undefined) query.set("is_verified", String(params.is_verified));
    if (params?.channel && params.channel !== "ALL") query.set("channel", params.channel);
    if (params?.search) query.set("search", params.search);
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_BASE}/api/reviews?${query.toString()}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {}

  let filtered = getStoredReviews();
  if (params?.sentiment && params.sentiment !== "ALL") {
    filtered = filtered.filter((r) => r.sentiment.toLowerCase() === params.sentiment!.toLowerCase());
  }
  if (params?.is_verified !== undefined) {
    filtered = filtered.filter((r) => r.is_verified === params.is_verified);
  }
  if (params?.channel && params.channel !== "ALL") {
    filtered = filtered.filter((r) => r.channel.toLowerCase() === params.channel!.toLowerCase());
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((r) => r.text.toLowerCase().includes(s) || r.author.toLowerCase().includes(s));
  }

  const counts = {
    total: filtered.length,
    positive: filtered.filter((r) => r.sentiment === "Positive").length,
    neutral: filtered.filter((r) => r.sentiment === "Neutral").length,
    negative: filtered.filter((r) => r.sentiment === "Negative").length,
  };

  return {
    summary: counts,
    reviews: filtered.slice(0, params?.limit || 100),
  };
}

export async function predictSentiment(text: string): Promise<PredictResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) return await res.json();
  } catch {}

  const pred = classifyText(text);
  return {
    text,
    sentiment: pred.sentiment,
    probabilities: pred.probabilities,
    confidence: pred.confidence,
    score: pred.score,
    normalized_score: pred.normalized_score,
  };
}

export async function submitNewReview(review: {
  text: string;
  author?: string;
  rating?: number;
  is_verified?: boolean;
  channel?: string;
}): Promise<{ message: string; review: Review }> {
  try {
    const res = await fetch(`${API_BASE}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (res.ok) return await res.json();
  } catch {}

  const newRev = addReviewToMemory(review);
  return {
    message: "Review analyzed and added successfully",
    review: newRev,
  };
}

export async function resetSeedReviews(): Promise<{ message: string; total_reviews: number }> {
  try {
    const res = await fetch(`${API_BASE}/api/reviews/reset`, { method: "POST" });
    if (res.ok) return await res.json();
  } catch {}

  const total = resetStoredReviews();
  return {
    message: "Reset to seed data complete",
    total_reviews: total,
  };
}
