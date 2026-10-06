export interface SentimentProbabilities {
  Positive: number;
  Neutral: number;
  Negative: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  is_verified: boolean;
  channel: string;
  helpful_votes: number;
  days_ago: number;
  timestamp: string;
  date: string;
  text: string;
  word_count: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  probabilities: SentimentProbabilities;
  confidence: number;
  score: number;
  normalized_score: number;
  nps_category?: "Promoter" | "Passive" | "Detractor";
}

export interface BrandHealthScore {
  score: number;
  status: "Excellent" | "Healthy" | "Moderate" | "At Risk";
  color: string;
  total_reviews: number;
  positive_count: number;
  positive_pct: number;
  neutral_count: number;
  neutral_pct: number;
  negative_count: number;
  negative_pct: number;
  avg_rating: number;
}

export interface TimeSeriesPoint {
  date: string;
  displayDate: string;
  dailySentiment: number;
  rawPolarity: number;
  volume: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  sma7: number;
  sma3: number;
}

export interface WeightedSentimentData {
  weighted_score: number;
  unweighted_score: number;
  delta: number;
  delta_percent: number;
  total_weight_applied: number;
  verified_avg: number;
  unverified_avg: number;
  verified_gap: number;
  long_reviews_avg: number;
  short_reviews_avg: number;
  length_gap: number;
  weights_formula: string;
  sample_reviews: {
    id: string;
    author: string;
    score: number;
    is_verified: boolean;
    word_count: number;
    helpful_votes: number;
    weight: number;
    m_verified: number;
    m_length: number;
    m_helpful: number;
  }[];
}

export interface EstimatedNPSData {
  nps_score: number;
  tier: string;
  tier_color: string;
  tier_desc: string;
  promoters_count: number;
  promoters_pct: number;
  passives_count: number;
  passives_pct: number;
  detractors_count: number;
  detractors_pct: number;
  total: number;
  thresholds: {
    promoter_condition: string;
    detractor_condition: string;
    passive_condition: string;
  };
}

export interface AlgorithmComparisonItem {
  id: string;
  name: string;
  score: number;
  scale: string;
  metricType: string;
  primaryUse: string;
  sensitivityToOutliers: string;
  biasMitigation: string;
  description: string;
}

export interface AlgorithmicVariationsResponse {
  time_series: TimeSeriesPoint[];
  weighted_sentiment: WeightedSentimentData;
  estimated_nps: EstimatedNPSData;
  latest_sma7: number;
  latest_daily: number;
  comparison_matrix: AlgorithmComparisonItem[];
}

export interface OverviewAnalyticsResponse {
  health_score: BrandHealthScore;
  time_series: TimeSeriesPoint[];
  channel_distribution: { channel: string; count: number }[];
  latest_update: string;
}

export interface PredictResponse {
  text: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  probabilities: SentimentProbabilities;
  confidence: number;
  score: number;
  normalized_score: number;
}
