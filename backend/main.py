"""
FastAPI Backend for Brand Perception Monitoring Dashboard
Serves ML sentiment predictions, seed reviews, time-series metrics,
and Algorithmic Variations (SMA, Weighted Sentiment, Estimated NPS).
"""

from datetime import datetime
import uuid
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model import classifier
from seed_data import generate_seed_reviews
from algorithms import (
    compute_brand_health_score,
    compute_time_series_analytics,
    compute_weighted_sentiment,
    compute_estimated_nps,
    compute_all_algorithmic_variations
)

app = FastAPI(
    title="Brand Perception Monitoring ML API",
    description="Supervised sentiment classification & algorithmic perception analytics",
    version="1.0.0"
)

# CORS middleware to allow Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store initialized with seed reviews
STORED_REVIEWS: list[dict] = []


def initialize_reviews():
    global STORED_REVIEWS
    STORED_REVIEWS = generate_seed_reviews(classifier_func=classifier.predict)


# Initialize seed data on module load
initialize_reviews()


# Pydantic Schemas
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=5000, description="Customer review text to classify")


class PredictResponse(BaseModel):
    text: str
    sentiment: str
    probabilities: dict
    confidence: float
    score: float
    normalized_score: float


class NewReviewRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=5000)
    author: Optional[str] = "Anonymous Customer"
    rating: Optional[int] = 5
    is_verified: Optional[bool] = True
    channel: Optional[str] = "Web Store"


# Endpoints
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "total_reviews": len(STORED_REVIEWS),
        "model_loaded": classifier.pipeline is not None
    }


@app.post("/api/predict", response_model=PredictResponse)
def predict_sentiment(req: PredictRequest):
    """
    Classifies a customer review using the supervised TF-IDF + Logistic Regression model.
    Returns Positive, Neutral, Negative probabilities and confidence score.
    """
    pred = classifier.predict(req.text)
    return {
        "text": req.text,
        "sentiment": pred["sentiment"],
        "probabilities": pred["probabilities"],
        "confidence": pred["confidence"],
        "score": pred["score"],
        "normalized_score": pred["normalized_score"]
    }


@app.get("/api/reviews")
def get_reviews(
    sentiment: Optional[str] = Query(None, description="Filter by sentiment: Positive, Neutral, Negative"),
    is_verified: Optional[bool] = Query(None, description="Filter by verified status"),
    channel: Optional[str] = Query(None, description="Filter by channel: Amazon, Trustpilot, etc."),
    search: Optional[str] = Query(None, description="Search text in reviews"),
    limit: Optional[int] = Query(100, ge=1, le=500)
):
    """
    Returns list of customer reviews with model inference results and optional filtering.
    """
    filtered = STORED_REVIEWS

    if sentiment:
        filtered = [r for r in filtered if r.get("sentiment", "").lower() == sentiment.lower()]

    if is_verified is not None:
        filtered = [r for r in filtered if r.get("is_verified") == is_verified]

    if channel:
        filtered = [r for r in filtered if r.get("channel", "").lower() == channel.lower()]

    if search:
        s = search.lower()
        filtered = [
            r for r in filtered
            if s in r.get("text", "").lower() or s in r.get("author", "").lower()
        ]

    # Calculate current summary metrics for filtered set
    counts = {
        "total": len(filtered),
        "positive": sum(1 for r in filtered if r.get("sentiment") == "Positive"),
        "neutral": sum(1 for r in filtered if r.get("sentiment") == "Neutral"),
        "negative": sum(1 for r in filtered if r.get("sentiment") == "Negative"),
    }

    return {
        "summary": counts,
        "reviews": filtered[:limit]
    }


@app.post("/api/reviews")
def add_review(req: NewReviewRequest):
    """
    Adds a new review in real-time, runs ML inference, and appends to dashboard data stream.
    """
    now = datetime.now()
    pred = classifier.predict(req.text)
    word_count = len(req.text.split())

    new_review = {
        "id": f"rev-{str(uuid.uuid4())[:8]}",
        "author": req.author or "Anonymous Customer",
        "rating": req.rating if req.rating is not None else 5,
        "is_verified": req.is_verified if req.is_verified is not None else True,
        "channel": req.channel or "Web Store",
        "helpful_votes": 0,
        "days_ago": 0,
        "timestamp": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "date": now.strftime("%Y-%m-%d"),
        "text": req.text,
        "word_count": word_count,
        "sentiment": pred["sentiment"],
        "probabilities": pred["probabilities"],
        "confidence": pred["confidence"],
        "score": pred["score"],
        "normalized_score": pred["normalized_score"],
    }

    STORED_REVIEWS.insert(0, new_review)

    return {
        "message": "Review analyzed and added successfully",
        "review": new_review
    }


@app.post("/api/reviews/reset")
def reset_reviews():
    """
    Resets the review collection back to the original 65+ seeded reviews.
    """
    initialize_reviews()
    return {"message": "Reset to seed data complete", "total_reviews": len(STORED_REVIEWS)}


@app.get("/api/analytics/overview")
def get_overview_analytics():
    """
    Provides High-Level Overview metrics:
    - Brand Health Score
    - Total review volume & sentiment distribution
    - 30-day time-series data with daily sentiment and volumes
    """
    health = compute_brand_health_score(STORED_REVIEWS)
    time_series = compute_time_series_analytics(STORED_REVIEWS, days_window=30)

    # Key sentiment driver keywords / themes
    top_channels = {}
    for r in STORED_REVIEWS:
        ch = r.get("channel", "Unknown")
        top_channels[ch] = top_channels.get(ch, 0) + 1

    return {
        "health_score": health,
        "time_series": time_series,
        "channel_distribution": [{"channel": k, "count": v} for k, v in top_channels.items()],
        "latest_update": datetime.now().isoformat()
    }


@app.get("/api/analytics/algorithmic-variations")
def get_algorithmic_variations():
    """
    Dedicated view comparing the 3 perception calculation methodologies:
    1. 7-day Simple Moving Average (SMA)
    2. Weighted Sentiment Score (verified purchase & length multipliers)
    3. Estimated Net Promoter Score (NPS) from probability extremes
    Plus side-by-side comparative matrix.
    """
    variations = compute_all_algorithmic_variations(STORED_REVIEWS)
    return variations


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
