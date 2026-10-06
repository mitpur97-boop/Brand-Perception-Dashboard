"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  MinusCircle,
  ThumbsDown,
  Star,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { OverviewAnalyticsResponse } from "@/lib/types";

interface OverviewTabProps {
  data: OverviewAnalyticsResponse | null;
  isLoading: boolean;
  onNavigateToReviews: () => void;
  onNavigateToAlgorithms: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  isLoading,
  onNavigateToReviews,
  onNavigateToAlgorithms,
}) => {
  const [showVolumeBars, setShowVolumeBars] = useState<boolean>(true);
  const [showSmaLine, setShowSmaLine] = useState<boolean>(true);

  if (isLoading || !data) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Crunching 30-day sentiment trajectories & ML signals...
        </p>
      </div>
    );
  }

  const { health_score, time_series, channel_distribution } = data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Healthy":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      case "Moderate":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      default:
        return "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent p-6 rounded-2xl border border-indigo-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-600 text-white">
              <Activity className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Brand Health & Perception Monitoring
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time supervised sentiment analysis across verified customer touchpoints. Evaluating 30-day temporal stability, sentiment distribution, and confidence trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToAlgorithms}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Explore Algorithmic Variations</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Brand Health Score Hero Card */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Brand Health Score
            </span>
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {health_score.score}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ 100</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ml-auto ${getStatusBadge(
                health_score.status
              )}`}
            >
              {health_score.status}
            </span>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${health_score.score}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Avg Rating: {health_score.avg_rating} / 5.0</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                Robust Trajectory
              </span>
            </div>
          </div>
        </div>

        {/* Total Review Volume */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Monitored Reviews
            </span>
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {health_score.total_reviews}
            </span>
            <span className="text-xs font-medium text-slate-500">Seed & Live</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Channels Covered</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {channel_distribution.length} Channels
            </span>
          </div>
        </div>

        {/* Positive Sentiment Volume */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Positive Sentiment
            </span>
            <ThumbsUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {health_score.positive_count}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ({health_score.positive_pct}%)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Advocacy Base</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Primary Driver
            </span>
          </div>
        </div>

        {/* Negative / Critical Sentiment */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Negative / Risk Alert
            </span>
            <ThumbsDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {health_score.negative_count}
            </span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              ({health_score.negative_pct}%)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Neutral: {health_score.neutral_count} ({health_score.neutral_pct}%)</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Attention Req.</span>
          </div>
        </div>
      </div>

      {/* Main Time-Series Chart Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                30-Day Sentiment Trajectory & Volatility
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tracking normalized daily perception score (0 to 100) vs 7-day Simple Moving Average (SMA) smoothing.
            </p>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmaLine(!showSmaLine)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                showSmaLine
                  ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
              }`}
            >
              7-Day SMA Trend
            </button>
            <button
              onClick={() => setShowVolumeBars(!showVolumeBars)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                showVolumeBars
                  ? "bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
              }`}
            >
              Volume Overlay
            </button>
          </div>
        </div>

        {/* Time-Series Chart Component */}
        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sentimentAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: "rgba(100, 116, 139, 0.9)" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
              />
              <YAxis
                yAxisId="sentiment"
                domain={[20, 100]}
                tick={{ fontSize: 11, fill: "rgba(100, 116, 139, 0.9)" }}
                tickLine={false}
                axisLine={false}
              />
              {showVolumeBars && (
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  domain={[0, 10]}
                  hide={true}
                />
              )}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[190px]">
                        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                          {item.date} ({item.displayDate})
                        </p>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Daily Sentiment:</span>
                          <span className="font-semibold text-indigo-400">{item.dailySentiment} / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">7-Day Rolling SMA:</span>
                          <span className="font-semibold text-purple-400">{item.sma7} / 100</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1 text-[11px]">
                          <span className="text-slate-400">Reviews Analyzed:</span>
                          <span className="font-bold text-slate-200">{item.volume}</span>
                        </div>
                        <div className="flex gap-2 text-[10px] pt-1">
                          <span className="text-emerald-400">+{item.positiveCount} Pos</span>
                          <span className="text-amber-400">~{item.neutralCount} Neu</span>
                          <span className="text-rose-400">-{item.negativeCount} Neg</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
              />

              {showVolumeBars && (
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  name="Daily Volume"
                  fill="#94a3b8"
                  opacity={0.3}
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              )}

              <Area
                yAxisId="sentiment"
                type="monotone"
                dataKey="dailySentiment"
                name="Daily Sentiment (0-100)"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#sentimentAreaGradient)"
                activeDot={{ r: 5, fill: "#6366f1" }}
              />

              {showSmaLine && (
                <Line
                  yAxisId="sentiment"
                  type="monotone"
                  dataKey="sma7"
                  name="7-Day Rolling SMA"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Informative Footer Box */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <p>
            <strong>Insight:</strong> The 7-day Simple Moving Average filters out single-day transient spikes caused by localized delivery delays or influencer mentions, highlighting true brand equity velocity. Notice how the dashed purple line maintains smooth stability while raw scores fluctuate.
          </p>
        </div>
      </div>

      {/* Touchpoint Breakdown & Model Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Feedback Channels Monitored
          </h3>
          <div className="space-y-3">
            {channel_distribution.map((ch) => {
              const pct = Math.round((ch.count / health_score.total_reviews) * 100);
              return (
                <div key={ch.channel} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {ch.channel}
                    </span>
                    <span className="text-slate-500">
                      {ch.count} reviews ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment Distribution Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Sentiment Composition
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  Positive Sentiment
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {health_score.positive_count} ({health_score.positive_pct}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Neutral Sentiment
                </span>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {health_score.neutral_count} ({health_score.neutral_pct}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  Negative Sentiment
                </span>
              </div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {health_score.negative_count} ({health_score.negative_pct}%)
              </span>
            </div>
          </div>
        </div>

        {/* ML Supervised Architecture Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/80 to-slate-900 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Supervised ML Engine</span>
            </div>
            <h4 className="text-lg font-bold text-white mt-2">
              Scikit-Learn Calibrated Classifier
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Reviews pass through n-gram TF-IDF vectorization with sublinear scaling and L2 regularization. Outputs calibrated Bayesian posteriors for Positive, Neutral, and Negative classes.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-700/50 flex items-center justify-between">
            <span className="text-xs text-indigo-200">Explore Individual Predictions</span>
            <button
              onClick={onNavigateToReviews}
              className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition"
            >
              View Feed &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
