"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Star,
  ThumbsUp,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Clock,
  Send,
  PlusCircle,
  BarChart2
} from "lucide-react";
import { Review } from "@/lib/types";

interface ReviewsTabProps {
  reviews: Review[];
  isLoading: boolean;
  onAddNewReview: (review: {
    text: string;
    author: string;
    rating: number;
    is_verified: boolean;
    channel: string;
  }) => Promise<void>;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  isLoading,
  onAddNewReview,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("ALL");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("recent");

  // State for Add Review Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState<number>(5);
  const [newChannel, setNewChannel] = useState("Trustpilot");
  const [newVerified, setNewVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (sentimentFilter !== "ALL" && r.sentiment.toUpperCase() !== sentimentFilter) {
          return false;
        }
        if (verifiedFilter === "VERIFIED" && !r.is_verified) return false;
        if (verifiedFilter === "UNVERIFIED" && r.is_verified) return false;
        if (channelFilter !== "ALL" && r.channel !== channelFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = r.text.toLowerCase().includes(q);
          const matchAuthor = r.author.toLowerCase().includes(q);
          if (!matchText && !matchAuthor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === "confidence") {
          return b.confidence - a.confidence;
        }
        if (sortBy === "helpful") {
          return b.helpful_votes - a.helpful_votes;
        }
        if (sortBy === "length") {
          return b.word_count - a.word_count;
        }
        return 0;
      });
  }, [reviews, searchQuery, sentimentFilter, verifiedFilter, channelFilter, sortBy]);

  const handleSubmitNewReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddNewReview({
        text: newText,
        author: newAuthor.trim() || "Anonymous Reviewer",
        rating: newRating,
        is_verified: newVerified,
        channel: newChannel,
      });
      setNewText("");
      setNewAuthor("");
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return {
          badge: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          bar: "bg-emerald-500",
        };
      case "Neutral":
        return {
          badge: "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
          bar: "bg-amber-500",
        };
      default:
        return {
          badge: "bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
          bar: "bg-rose-500",
        };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Customer Reviews & Model Predictions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse through individual reviews with live supervised ML sentiment classifications, Bayesian confidence ratings, and class posterior breakdowns.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isFormOpen ? "Close Form" : "Test & Add Custom Review"}</span>
        </button>
      </div>

      {/* Inline Form to Add & Classify a Custom Review */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitNewReview}
          className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-4 transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Machine Learning Inference & Review Submission
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer Review Text
            </label>
            <textarea
              required
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g., The handloom weave was surprisingly durable and lightweight! Arrived right on time in eco-friendly packing."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Author Name
              </label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Rating
              </label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Poor)</option>
                <option value={1}>1 Star (Terrible)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Channel
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Trustpilot">Trustpilot</option>
                <option value="Amazon">Amazon</option>
                <option value="Google Reviews">Google Reviews</option>
                <option value="App Store">App Store</option>
                <option value="Twitter/X">Twitter/X</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={newVerified}
                  onChange={(e) => setNewVerified(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Verified Buyer (+35% Weight)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Classifying with ML..." : "Run ML Classifier & Add"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by review keywords, product features, or reviewer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sentiment Quick Filters */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"].map((st) => (
              <button
                key={st}
                onClick={() => setSentimentFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  sentimentFilter === st
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {st === "ALL" ? "All Sentiments" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Verified status dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Verification:</span>
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Reviews</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="UNVERIFIED">Unverified Only</option>
              </select>
            </div>

            {/* Channel dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Channels</option>
                <option value="Trustpilot">Trustpilot</option>
                <option value="Amazon">Amazon</option>
                <option value="Google Reviews">Google Reviews</option>
                <option value="App Store">App Store</option>
                <option value="Twitter/X">Twitter/X</option>
              </select>
            </div>
          </div>

          {/* Sort By dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="recent">Most Recent Date</option>
              <option value="confidence">Highest Confidence</option>
              <option value="helpful">Most Helpful Votes</option>
              <option value="length">Detailed Length</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Count Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredReviews.length}</strong> of {reviews.length} reviews
        </span>
      </div>

      {/* Review Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No customer reviews match your active filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSentimentFilter("ALL");
              setVerifiedFilter("ALL");
              setChannelFilter("ALL");
            }}
            className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const style = getSentimentStyle(rev.sentiment);
            const posPct = Math.round((rev.probabilities?.Positive || 0) * 100);
            const neuPct = Math.round((rev.probabilities?.Neutral || 0) * 100);
            const negPct = Math.round((rev.probabilities?.Negative || 0) * 100);
            const confPct = Math.round(rev.confidence * 100);

            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3"
              >
                {/* Review Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar Initials */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                      {rev.author
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {rev.author}
                        </span>
                        {rev.is_verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {rev.days_ago === 0 ? "Today" : `${rev.days_ago} days ago`}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {rev.channel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Model Classification Badges */}
                  <div className="flex items-center gap-2">
                    {/* Visual Star Rating */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Predicted Sentiment Badge */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${style.badge}`}
                    >
                      {rev.sentiment}
                    </span>

                    {/* Model Confidence Badge */}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {confPct}% Confidence
                    </span>
                  </div>
                </div>

                {/* Review Text Body */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{rev.text}"
                </p>

                {/* Model Probabilities Bar & Metadata Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {/* Probability Breakdown Gauge */}
                  <div className="flex-1 max-w-md space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Pos: {posPct}%
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Neu: {neuPct}%
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">
                        Neg: {negPct}%
                      </span>
                    </div>
                    {/* Multi-segment stacked probability bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${posPct}%` }}
                        title={`Positive: ${posPct}%`}
                      />
                      <div
                        className="bg-amber-400 h-full"
                        style={{ width: `${neuPct}%` }}
                        title={`Neutral: ${neuPct}%`}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${negPct}%` }}
                        title={`Negative: ${negPct}%`}
                      />
                    </div>
                  </div>

                  {/* Metadata Stats */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 self-end sm:self-center">
                    <span>{rev.word_count} words</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      {rev.helpful_votes} helpful
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">
                      Score: {rev.normalized_score}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
