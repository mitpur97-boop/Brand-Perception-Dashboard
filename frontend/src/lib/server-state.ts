import initialReviews from "./seed-reviews.json";
import { classifyText } from "./ml-classifier";
import {
  Review,
  BrandHealthScore,
  TimeSeriesPoint,
  WeightedSentimentData,
  EstimatedNPSData,
  AlgorithmicVariationsResponse,
  OverviewAnalyticsResponse,
} from "./types";

// In-memory reviews store for the serverless/local runtime
let memoryReviews: Review[] = JSON.parse(JSON.stringify(initialReviews));

export function getStoredReviews(): Review[] {
  return memoryReviews;
}

export function resetStoredReviews(): number {
  memoryReviews = JSON.parse(JSON.stringify(initialReviews));
  return memoryReviews.length;
}

export function addReviewToMemory(reviewData: {
  text: string;
  author?: string;
  rating?: number;
  is_verified?: boolean;
  channel?: string;
}): Review {
  const pred = classifyText(reviewData.text);
  const now = new Date();
  const wordCount = reviewData.text.trim().split(/\s+/).length;

  const newReview: Review = {
    id: `rev-${Math.random().toString(36).substring(2, 9)}`,
    author: reviewData.author || "Anonymous Customer",
    rating: reviewData.rating ?? 5,
    is_verified: reviewData.is_verified ?? true,
    channel: reviewData.channel || "Web Store",
    helpful_votes: 0,
    days_ago: 0,
    timestamp: now.toISOString(),
    date: now.toISOString().split("T")[0],
    text: reviewData.text,
    word_count: wordCount,
    sentiment: pred.sentiment,
    probabilities: pred.probabilities,
    confidence: pred.confidence,
    score: pred.score,
    normalized_score: pred.normalized_score,
  };

  memoryReviews.unshift(newReview);
  return newReview;
}

export function computeBrandHealth(reviews: Review[]): BrandHealthScore {
  const total = reviews.length;
  if (total === 0) {
    return {
      score: 50,
      status: "Moderate",
      color: "amber",
      total_reviews: 0,
      positive_count: 0,
      positive_pct: 0,
      neutral_count: 0,
      neutral_pct: 0,
      negative_count: 0,
      negative_pct: 0,
      avg_rating: 3.0,
    };
  }

  const posCount = reviews.filter((r) => r.sentiment === "Positive").length;
  const neuCount = reviews.filter((r) => r.sentiment === "Neutral").length;
  const negCount = reviews.filter((r) => r.sentiment === "Negative").length;

  const avgNormalized =
    reviews.reduce((acc, r) => acc + (r.normalized_score ?? 50), 0) / total;
  const posRatio = (posCount / total) * 100;
  const negRatio = (negCount / total) * 100;

  let healthScore = Math.round((avgNormalized * 0.6 + (posRatio - negRatio * 0.8 + 100) * 0.2) * 10) / 10;
  healthScore = Math.max(0, Math.min(100, healthScore));

  let status: BrandHealthScore["status"] = "Moderate";
  let color = "amber";
  if (healthScore >= 80) {
    status = "Excellent";
    color = "emerald";
  } else if (healthScore >= 65) {
    status = "Healthy";
    color = "blue";
  } else if (healthScore < 45) {
    status = "At Risk";
    color = "rose";
  }

  const avgRating =
    Math.round(
      (reviews.reduce((acc, r) => acc + (r.rating ?? 3), 0) / total) * 100
    ) / 100;

  return {
    score: healthScore,
    status,
    color,
    total_reviews: total,
    positive_count: posCount,
    positive_pct: Math.round((posCount / total) * 1000) / 10,
    neutral_count: neuCount,
    neutral_pct: Math.round((neuCount / total) * 1000) / 10,
    negative_count: negCount,
    negative_pct: Math.round((negCount / total) * 1000) / 10,
    avg_rating: avgRating,
  };
}

export function computeTimeSeries(reviews: Review[], windowDays = 30): TimeSeriesPoint[] {
  const today = new Date();
  const dailyGroups: Record<string, Review[]> = {};

  for (const r of reviews) {
    const dStr = r.date || (r.timestamp ? r.timestamp.slice(0, 10) : "");
    if (dStr) {
      if (!dailyGroups[dStr]) dailyGroups[dStr] = [];
      dailyGroups[dStr].push(r);
    }
  }

  const timeline: TimeSeriesPoint[] = [];
  const rawScores: number[] = [];

  for (let i = windowDays - 1; i >= 0; i--) {
    const curDate = new Date(today);
    curDate.setDate(curDate.getDate() - i);
    const dateStr = curDate.toISOString().slice(0, 10);
    const dayReviews = dailyGroups[dateStr] || [];

    const vol = dayReviews.length;
    const pos = dayReviews.filter((r) => r.sentiment === "Positive").length;
    const neu = dayReviews.filter((r) => r.sentiment === "Neutral").length;
    const neg = dayReviews.filter((r) => r.sentiment === "Negative").length;

    let dayScore: number;
    let dayRawScore: number;

    if (vol > 0) {
      dayScore =
        dayReviews.reduce((sum, r) => sum + (r.normalized_score ?? 50), 0) / vol;
      dayRawScore =
        dayReviews.reduce((sum, r) => sum + (r.score ?? 0), 0) / vol;
    } else {
      dayScore = rawScores.length > 0 ? rawScores[rawScores.length - 1] : 50;
      dayRawScore = 0;
    }

    rawScores.push(dayScore);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const displayDate = `${monthNames[curDate.getMonth()]} ${String(curDate.getDate()).padStart(2, "0")}`;

    timeline.push({
      date: dateStr,
      displayDate,
      dailySentiment: Math.round(dayScore * 10) / 10,
      rawPolarity: Math.round(dayRawScore * 1000) / 1000,
      volume: vol,
      positiveCount: pos,
      neutralCount: neu,
      negativeCount: neg,
      sma7: 0,
      sma3: 0,
    });
  }

  // Compute SMA-7 and SMA-3
  for (let idx = 0; idx < timeline.length; idx++) {
    const start7 = Math.max(0, idx - 6);
    const slice7 = rawScores.slice(start7, idx + 1);
    timeline[idx].sma7 =
      Math.round((slice7.reduce((a, b) => a + b, 0) / slice7.length) * 10) / 10;

    const start3 = Math.max(0, idx - 2);
    const slice3 = rawScores.slice(start3, idx + 1);
    timeline[idx].sma3 =
      Math.round((slice3.reduce((a, b) => a + b, 0) / slice3.length) * 10) / 10;
  }

  return timeline;
}

export function computeWeighted(reviews: Review[]): WeightedSentimentData {
  let totalWeight = 0;
  let weightedSum = 0;
  const unweightedList: number[] = [];

  const verifiedScores: number[] = [];
  const unverifiedScores: number[] = [];
  const longScores: number[] = [];
  const shortScores: number[] = [];

  const sampleReviews: WeightedSentimentData["sample_reviews"] = [];

  for (const r of reviews) {
    const score = r.normalized_score ?? 50;
    unweightedList.push(score);

    const isVerified = Boolean(r.is_verified);
    const wordCount = r.word_count || r.text.trim().split(/\s+/).length;
    const helpful = r.helpful_votes || 0;

    const mVerified = isVerified ? 1.35 : 1.0;
    const mLength = Math.round((1.0 + Math.min(0.5, (wordCount / 80.0) * 0.5)) * 100) / 100;
    const mHelpful = Math.round((1.0 + Math.min(0.2, Math.log10(1 + helpful) * 0.15)) * 100) / 100;

    const totalMultiplier = Math.round(mVerified * mLength * mHelpful * 1000) / 1000;

    weightedSum += score * totalMultiplier;
    totalWeight += totalMultiplier;

    if (isVerified) verifiedScores.push(score);
    else unverifiedScores.push(score);

    if (wordCount >= 40) longScores.push(score);
    else shortScores.push(score);

    if (sampleReviews.length < 8) {
      sampleReviews.push({
        id: r.id,
        author: r.author,
        score: Math.round(score * 10) / 10,
        is_verified: isVerified,
        word_count: wordCount,
        helpful_votes: helpful,
        weight: totalMultiplier,
        m_verified: mVerified,
        m_length: mLength,
        m_helpful: mHelpful,
      });
    }
  }

  const weightedAvg = Math.round((weightedSum / totalWeight) * 10) / 10;
  const unweightedAvg =
    Math.round((unweightedList.reduce((a, b) => a + b, 0) / unweightedList.length) * 10) / 10;
  const delta = Math.round((weightedAvg - unweightedAvg) * 10) / 10;

  const avgVer = verifiedScores.length
    ? Math.round((verifiedScores.reduce((a, b) => a + b, 0) / verifiedScores.length) * 10) / 10
    : unweightedAvg;
  const avgUnver = unverifiedScores.length
    ? Math.round((unverifiedScores.reduce((a, b) => a + b, 0) / unverifiedScores.length) * 10) / 10
    : unweightedAvg;

  const avgLong = longScores.length
    ? Math.round((longScores.reduce((a, b) => a + b, 0) / longScores.length) * 10) / 10
    : unweightedAvg;
  const avgShort = shortScores.length
    ? Math.round((shortScores.reduce((a, b) => a + b, 0) / shortScores.length) * 10) / 10
    : unweightedAvg;

  return {
    weighted_score: weightedAvg,
    unweighted_score: unweightedAvg,
    delta,
    delta_percent: Math.round((delta / unweightedAvg) * 10000) / 100,
    total_weight_applied: Math.round(totalWeight * 10) / 10,
    verified_avg: avgVer,
    unverified_avg: avgUnver,
    verified_gap: Math.round((avgVer - avgUnver) * 10) / 10,
    long_reviews_avg: avgLong,
    short_reviews_avg: avgShort,
    length_gap: Math.round((avgLong - avgShort) * 10) / 10,
    weights_formula:
      "W = Multiplier(Verified: 1.35x) * Multiplier(Length: up to 1.5x) * Multiplier(Helpful: up to 1.2x)",
    sample_reviews: sampleReviews,
  };
}

export function computeNps(reviews: Review[]): EstimatedNPSData {
  const total = reviews.length;
  if (total === 0) {
    return {
      nps_score: 0,
      tier: "Neutral",
      tier_color: "amber",
      tier_desc: "No review data available.",
      promoters_count: 0,
      promoters_pct: 0,
      passives_count: 0,
      passives_pct: 0,
      detractors_count: 0,
      detractors_pct: 0,
      total: 0,
      thresholds: {
        promoter_condition: "P(Positive) >= 0.42 or P(Pos) - P(Neg) >= 0.15",
        detractor_condition: "P(Negative) >= 0.40 or P(Neg) - P(Pos) >= 0.15",
        passive_condition: "Moderate or balanced probabilities",
      },
    };
  }

  let promotersCount = 0;
  let detractorsCount = 0;
  let passivesCount = 0;

  for (const r of reviews) {
    const posP = r.probabilities?.Positive ?? 0.33;
    const negP = r.probabilities?.Negative ?? 0.33;
    const sentiment = r.sentiment;

    if (
      (sentiment === "Positive" && (posP >= 0.42 || posP - negP >= 0.15)) ||
      posP >= 0.5
    ) {
      promotersCount++;
      r.nps_category = "Promoter";
    } else if (
      (sentiment === "Negative" && (negP >= 0.4 || negP - posP >= 0.15)) ||
      negP >= 0.45
    ) {
      detractorsCount++;
      r.nps_category = "Detractor";
    } else {
      passivesCount++;
      r.nps_category = "Passive";
    }
  }

  const promotersPct = Math.round((promotersCount / total) * 1000) / 10;
  const passivesPct = Math.round((passivesCount / total) * 1000) / 10;
  const detractorsPct = Math.round((detractorsCount / total) * 1000) / 10;

  const npsScore = Math.round((promotersPct - detractorsPct) * 10) / 10;

  let tier = "Favorable";
  let tierColor = "amber";
  let tierDesc = "More promoters than detractors, but passives represent churn opportunity.";

  if (npsScore >= 50) {
    tier = "World Class";
    tierColor = "emerald";
    tierDesc = "Customers have exceptionally high organic advocacy and strong loyalty.";
  } else if (npsScore >= 30) {
    tier = "Strong";
    tierColor = "blue";
    tierDesc = "Healthy brand advocacy significantly outweighs negative sentiment.";
  } else if (npsScore < 0) {
    tier = "Critical";
    tierColor = "rose";
    tierDesc = "Detractors outnumber promoters. Immediate customer experience intervention needed.";
  }

  return {
    nps_score: npsScore,
    tier,
    tier_color: tierColor,
    tier_desc: tierDesc,
    promoters_count: promotersCount,
    promoters_pct: promotersPct,
    passives_count: passivesCount,
    passives_pct: passivesPct,
    detractors_count: detractorsCount,
    detractors_pct: detractorsPct,
    total,
    thresholds: {
      promoter_condition: "P(Positive) >= 0.42 or P(Pos) - P(Neg) >= 0.15",
      detractor_condition: "P(Negative) >= 0.40 or P(Neg) - P(Pos) >= 0.15",
      passive_condition: "Moderate or balanced probabilities",
    },
  };
}

export function getAllVariations(): AlgorithmicVariationsResponse {
  const reviews = getStoredReviews();
  const timeSeries = computeTimeSeries(reviews, 30);
  const weighted = computeWeighted(reviews);
  const nps = computeNps(reviews);

  const latestSma7 = timeSeries.length ? timeSeries[timeSeries.length - 1].sma7 : 50;
  const latestDaily = timeSeries.length ? timeSeries[timeSeries.length - 1].dailySentiment : 50;

  return {
    time_series: timeSeries,
    weighted_sentiment: weighted,
    estimated_nps: nps,
    latest_sma7: latestSma7,
    latest_daily: latestDaily,
    comparison_matrix: [
      {
        id: "sma7",
        name: "7-Day Simple Moving Average (SMA)",
        score: latestSma7,
        scale: "0 - 100",
        metricType: "Trend Smoothed",
        primaryUse: "Filters daily noise and highlights medium-term momentum",
        sensitivityToOutliers: "Low (Averaged over 7 days)",
        biasMitigation: "Temporal smoothing",
        description: "Calculates rolling arithmetic mean of daily sentiment scores across a 7-day sliding window.",
      },
      {
        id: "weighted",
        name: "Weighted Sentiment Score",
        score: weighted.weighted_score,
        scale: "0 - 100",
        metricType: "Credibility & Depth Adjusted",
        primaryUse: "Mitigates bot/troll noise by elevating verified buyers and in-depth reviews",
        sensitivityToOutliers: "Moderate (Grounded by multipliers)",
        biasMitigation: "Downweights short unverified spam",
        description: "Applies +35% weight to verified purchases, +10-50% for detailed length, and helpfulness boosts.",
      },
      {
        id: "nps",
        name: "Estimated Net Promoter Score (NPS)",
        score: nps.nps_score,
        scale: "-100 to +100",
        metricType: "Extreme Polarity Index",
        primaryUse: "Gauges viral advocacy vs brand detractors by focusing on probability extremes",
        sensitivityToOutliers: "High (Sensitive to polarity shifts)",
        biasMitigation: "Filters passive ambiguity",
        description: "Derived from model probability extremes: % Promoters minus % Detractors.",
      },
      {
        id: "unweighted",
        name: "Standard Arithmetic Mean (Baseline)",
        score: weighted.unweighted_score,
        scale: "0 - 100",
        metricType: "Unweighted Baseline",
        primaryUse: "Standard benchmark with equal weighting for all reviews",
        sensitivityToOutliers: "High (Single review equally alters mean)",
        biasMitigation: "None",
        description: "Simple average of normalized sentiment scores without contextual adjustments.",
      },
    ],
  };
}

export function getOverview(): OverviewAnalyticsResponse {
  const reviews = getStoredReviews();
  const health = computeBrandHealth(reviews);
  const timeSeries = computeTimeSeries(reviews, 30);

  const channelMap: Record<string, number> = {};
  for (const r of reviews) {
    channelMap[r.channel] = (channelMap[r.channel] || 0) + 1;
  }

  return {
    health_score: health,
    time_series: timeSeries,
    channel_distribution: Object.entries(channelMap).map(([channel, count]) => ({
      channel,
      count,
    })),
    latest_update: new Date().toISOString(),
  };
}
