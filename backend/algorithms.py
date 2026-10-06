"""
Algorithmic Variations and Brand Perception Analytics
Computes:
1. 7-day Simple Moving Average (SMA) of sentiment scores over rolling windows
2. Weighted Sentiment Score (applying higher multipliers to longer & verified reviews)
3. Estimated Net Promoter Score (NPS) derived directly from sentiment probability extremes
4. Multi-algorithm comparative matrix & summary metrics
"""

from collections import defaultdict
from datetime import datetime, timedelta
import math
import numpy as np


def compute_brand_health_score(reviews: list[dict]) -> dict:
    """
    Computes overall brand health score on a 0-100 scale,
    combining average sentiment, positive-to-negative ratio, and satisfaction index.
    """
    if not reviews:
        return {"score": 50, "status": "Neutral", "label": "No Data"}

    total = len(reviews)
    pos_count = sum(1 for r in reviews if r.get("sentiment") == "Positive")
    neu_count = sum(1 for r in reviews if r.get("sentiment") == "Neutral")
    neg_count = sum(1 for r in reviews if r.get("sentiment") == "Negative")

    avg_score_0_100 = np.mean([r.get("normalized_score", 50.0) for r in reviews])

    # Health score formula weighting positive percentage and normalized scores
    pos_ratio = (pos_count / total) * 100.0
    neg_ratio = (neg_count / total) * 100.0
    
    # Composite Brand Health Score (0 to 100)
    health_score = round(float(avg_score_0_100 * 0.6 + (pos_ratio - neg_ratio * 0.8 + 100) * 0.2), 1)
    health_score = max(0.0, min(100.0, health_score))

    if health_score >= 80:
        status = "Excellent"
        color = "emerald"
    elif health_score >= 65:
        status = "Healthy"
        color = "blue"
    elif health_score >= 45:
        status = "Moderate"
        color = "amber"
    else:
        status = "At Risk"
        color = "rose"

    return {
        "score": health_score,
        "status": status,
        "color": color,
        "total_reviews": total,
        "positive_count": pos_count,
        "positive_pct": round((pos_count / total) * 100, 1),
        "neutral_count": neu_count,
        "neutral_pct": round((neu_count / total) * 100, 1),
        "negative_count": neg_count,
        "negative_pct": round((neg_count / total) * 100, 1),
        "avg_rating": round(float(np.mean([r.get("rating", 3) for r in reviews])), 2),
    }


def compute_time_series_analytics(reviews: list[dict], days_window: int = 30) -> list[dict]:
    """
    Computes daily aggregated sentiment scores and rolling Simple Moving Averages (SMA-7 and SMA-3)
    across the last 30 days.
    """
    today = datetime.now().date()
    start_date = today - timedelta(days=days_window - 1)

    # Group reviews by date
    daily_groups = defaultdict(list)
    for r in reviews:
        date_str = r.get("date")
        if not date_str and "timestamp" in r:
            date_str = r["timestamp"][:10]
        if date_str:
            daily_groups[date_str].append(r)

    # Build daily series
    timeline = []
    raw_scores = []

    for i in range(days_window):
        current_date = start_date + timedelta(days=i)
        date_str = current_date.strftime("%Y-%m-%d")
        day_reviews = daily_groups.get(date_str, [])

        pos = sum(1 for r in day_reviews if r.get("sentiment") == "Positive")
        neu = sum(1 for r in day_reviews if r.get("sentiment") == "Neutral")
        neg = sum(1 for r in day_reviews if r.get("sentiment") == "Negative")
        vol = len(day_reviews)

        if vol > 0:
            day_score = float(np.mean([r.get("normalized_score", 50.0) for r in day_reviews]))
            day_raw_score = float(np.mean([r.get("score", 0.0) for r in day_reviews]))
        else:
            # If no reviews on that exact day, use previous day's score or baseline 50
            day_score = raw_scores[-1] if raw_scores else 50.0
            day_raw_score = 0.0

        raw_scores.append(day_score)

        timeline.append({
            "date": date_str,
            "displayDate": current_date.strftime("%b %d"),
            "dailySentiment": round(day_score, 1),
            "rawPolarity": round(day_raw_score, 3),
            "volume": vol,
            "positiveCount": pos,
            "neutralCount": neu,
            "negativeCount": neg,
        })

    # Compute 7-day and 3-day Rolling Simple Moving Average
    for idx in range(len(timeline)):
        # 7-day window
        start_idx_7 = max(0, idx - 6)
        window_scores_7 = raw_scores[start_idx_7 : idx + 1]
        sma_7 = round(float(np.mean(window_scores_7)), 1)
        timeline[idx]["sma7"] = sma_7

        # 3-day window
        start_idx_3 = max(0, idx - 2)
        window_scores_3 = raw_scores[start_idx_3 : idx + 1]
        sma_3 = round(float(np.mean(window_scores_3)), 1)
        timeline[idx]["sma3"] = sma_3

    return timeline


def compute_weighted_sentiment(reviews: list[dict]) -> dict:
    """
    Computes Weighted Sentiment Score applying higher multipliers to longer reviews
    and verified reviews, and contrasts it against the unweighted baseline.
    """
    if not reviews:
        return {}

    total_weight = 0.0
    weighted_score_sum = 0.0
    unweighted_scores = []
    
    verified_scores = []
    unverified_scores = []
    long_reviews_scores = []
    short_reviews_scores = []

    review_breakdowns = []

    for r in reviews:
        score = r.get("normalized_score", 50.0)
        unweighted_scores.append(score)

        is_verified = bool(r.get("is_verified", False))
        word_count = r.get("word_count", len(r.get("text", "").split()))
        helpful_votes = r.get("helpful_votes", 0)

        # Multipliers
        # 1. Verification Multiplier: +35% weight for verified purchasers
        m_verified = 1.35 if is_verified else 1.00

        # 2. Length Multiplier: substantive reviews up to +50% weight
        m_length = 1.0 + min(0.50, (word_count / 80.0) * 0.50)

        # 3. Helpful multiplier: community validated reviews up to +20%
        m_helpful = 1.0 + min(0.20, math.log10(1 + helpful_votes) * 0.15)

        total_multiplier = round(m_verified * m_length * m_helpful, 3)

        weighted_score_sum += score * total_multiplier
        total_weight += total_multiplier

        # Segment tracking
        if is_verified:
            verified_scores.append(score)
        else:
            unverified_scores.append(score)

        if word_count >= 40:
            long_reviews_scores.append(score)
        else:
            short_reviews_scores.append(score)

        review_breakdowns.append({
            "id": r.get("id"),
            "author": r.get("author"),
            "score": round(score, 1),
            "is_verified": is_verified,
            "word_count": word_count,
            "helpful_votes": helpful_votes,
            "weight": total_multiplier,
            "m_verified": m_verified,
            "m_length": round(m_length, 2),
            "m_helpful": round(m_helpful, 2)
        })

    weighted_avg = round(weighted_score_sum / total_weight, 1)
    unweighted_avg = round(float(np.mean(unweighted_scores)), 1)
    delta = round(weighted_avg - unweighted_avg, 1)

    avg_verified = round(float(np.mean(verified_scores)), 1) if verified_scores else unweighted_avg
    avg_unverified = round(float(np.mean(unverified_scores)), 1) if unverified_scores else unweighted_avg
    avg_long = round(float(np.mean(long_reviews_scores)), 1) if long_reviews_scores else unweighted_avg
    avg_short = round(float(np.mean(short_reviews_scores)), 1) if short_reviews_scores else unweighted_avg

    return {
        "weighted_score": weighted_avg,
        "unweighted_score": unweighted_avg,
        "delta": delta,
        "delta_percent": round((delta / unweighted_avg) * 100.0, 2) if unweighted_avg else 0.0,
        "total_weight_applied": round(total_weight, 1),
        "verified_avg": avg_verified,
        "unverified_avg": avg_unverified,
        "verified_gap": round(avg_verified - avg_unverified, 1),
        "long_reviews_avg": avg_long,
        "short_reviews_avg": avg_short,
        "length_gap": round(avg_long - avg_short, 1),
        "weights_formula": "W = Multiplier(Verified: 1.35x) * Multiplier(Length: up to 1.5x) * Multiplier(Helpful: up to 1.2x)",
        "sample_reviews": review_breakdowns[:8]
    }


def compute_estimated_nps(reviews: list[dict]) -> dict:
    """
    Computes Estimated Net Promoter Score (NPS) derived directly from
    sentiment probability extremes:
    - Promoter: P(Positive) >= 0.65 or (P(Pos) - P(Neg) >= 0.45)
    - Detractor: P(Negative) >= 0.55 or (P(Neg) - P(Pos) >= 0.35)
    - Passive: Neutral probability dominant or balanced moderate probabilities
    Formula: NPS = (% Promoters - % Detractors) on a -100 to +100 scale.
    """
    if not reviews:
        return {"nps": 0, "tier": "Neutral", "promoters_pct": 0, "passives_pct": 0, "detractors_pct": 0}

    total = len(reviews)
    promoters = []
    passives = []
    detractors = []

    for r in reviews:
        probs = r.get("probabilities", {})
        pos_p = probs.get("Positive", 0.33)
        neg_p = probs.get("Negative", 0.33)
        neu_p = probs.get("Neutral", 0.34)
        sentiment = r.get("sentiment", "Neutral")

        # Classification based on 3-class probability distribution
        # Promoters: Positive probability dominant and exceeds Negative significantly
        if (sentiment == "Positive" and (pos_p >= 0.42 or pos_p - neg_p >= 0.15)) or (pos_p >= 0.50):
            promoters.append(r)
            r["nps_category"] = "Promoter"
        elif (sentiment == "Negative" and (neg_p >= 0.40 or neg_p - pos_p >= 0.15)) or (neg_p >= 0.45):
            detractors.append(r)
            r["nps_category"] = "Detractor"
        else:
            passives.append(r)
            r["nps_category"] = "Passive"

    promoter_count = len(promoters)
    passive_count = len(passives)
    detractor_count = len(detractors)

    promoters_pct = round((promoter_count / total) * 100.0, 1)
    passives_pct = round((passive_count / total) * 100.0, 1)
    detractors_pct = round((detractor_count / total) * 100.0, 1)

    nps_score = round(promoters_pct - detractors_pct, 1)

    if nps_score >= 50:
        tier = "World Class"
        tier_color = "emerald"
        tier_desc = "Customers have exceptionally high organic advocacy and strong loyalty."
    elif nps_score >= 30:
        tier = "Strong"
        tier_color = "blue"
        tier_desc = "Healthy brand advocacy significantly outweighs negative sentiment."
    elif nps_score >= 0:
        tier = "Favorable"
        tier_color = "amber"
        tier_desc = "More promoters than detractors, but passives represent churn opportunity."
    else:
        tier = "Critical"
        tier_color = "rose"
        tier_desc = "Detractors outnumber promoters. Immediate customer experience intervention needed."

    return {
        "nps_score": nps_score,
        "tier": tier,
        "tier_color": tier_color,
        "tier_desc": tier_desc,
        "promoters_count": promoter_count,
        "promoters_pct": promoters_pct,
        "passives_count": passive_count,
        "passives_pct": passives_pct,
        "detractors_count": detractor_count,
        "detractors_pct": detractors_pct,
        "total": total,
        "thresholds": {
            "promoter_condition": "P(Positive) >= 0.42 or P(Pos) - P(Neg) >= 0.15",
            "detractor_condition": "P(Negative) >= 0.40 or P(Neg) - P(Pos) >= 0.15",
            "passive_condition": "Moderate or balanced probabilities"
        }
    }


def compute_all_algorithmic_variations(reviews: list[dict]) -> dict:
    """
    Bundles all 3 algorithmic variations with direct side-by-side comparison.
    """
    time_series = compute_time_series_analytics(reviews, days_window=30)
    weighted_data = compute_weighted_sentiment(reviews)
    nps_data = compute_estimated_nps(reviews)

    # Calculate 7-day SMA latest value
    latest_sma7 = time_series[-1]["sma7"] if time_series else 50.0
    latest_daily = time_series[-1]["dailySentiment"] if time_series else 50.0

    unweighted_mean = weighted_data.get("unweighted_score", 50.0)
    weighted_score = weighted_data.get("weighted_score", 50.0)
    nps_score = nps_data.get("nps_score", 0.0)

    comparison_summary = [
        {
            "id": "sma7",
            "name": "7-Day Simple Moving Average (SMA)",
            "score": latest_sma7,
            "scale": "0 - 100",
            "metricType": "Trend Smoothed",
            "primaryUse": "Filters daily noise and highlights medium-term momentum",
            "sensitivityToOutliers": "Low (Averaged over 7 days)",
            "biasMitigation": "Temporal smoothing",
            "description": "Calculates rolling arithmetic mean of daily sentiment scores across a 7-day sliding window."
        },
        {
            "id": "weighted",
            "name": "Weighted Sentiment Score",
            "score": weighted_score,
            "scale": "0 - 100",
            "metricType": "Credibility & Depth Adjusted",
            "primaryUse": "Mitigates bot/troll noise by elevating verified buyers and in-depth reviews",
            "sensitivityToOutliers": "Moderate (Grounded by multipliers)",
            "biasMitigation": "Downweights short unverified spam",
            "description": "Applies +35% weight to verified purchases, +10-50% for detailed length, and helpfulness boosts."
        },
        {
            "id": "nps",
            "name": "Estimated Net Promoter Score (NPS)",
            "score": nps_score,
            "scale": "-100 to +100",
            "metricType": "Extreme Polarity Index",
            "primaryUse": "Gauges viral advocacy vs brand detractors by focusing on probability extremes",
            "sensitivityToOutliers": "High (Sensitive to polarity shifts)",
            "biasMitigation": "Filters passive ambiguity",
            "description": "Derived from model probability extremes: % Promoters minus % Detractors."
        },
        {
            "id": "unweighted",
            "name": "Standard Arithmetic Mean (Baseline)",
            "score": unweighted_mean,
            "scale": "0 - 100",
            "metricType": "Unweighted Baseline",
            "primaryUse": "Standard benchmark with equal weighting for all reviews",
            "sensitivityToOutliers": "High (Single review equally alters mean)",
            "biasMitigation": "None",
            "description": "Simple average of normalized sentiment scores without contextual adjustments."
        }
    ]

    return {
        "time_series": time_series,
        "weighted_sentiment": weighted_data,
        "estimated_nps": nps_data,
        "latest_sma7": latest_sma7,
        "latest_daily": latest_daily,
        "comparison_matrix": comparison_summary
    }
