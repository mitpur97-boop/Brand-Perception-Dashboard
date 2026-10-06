"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  Layers,
  TrendingUp,
  Scale,
  Award,
  HelpCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sliders,
  ChevronRight,
  Info,
  Check,
  TrendingDown
} from "lucide-react";
import { AlgorithmicVariationsResponse } from "@/lib/types";

interface AlgorithmicVariationsTabProps {
  data: AlgorithmicVariationsResponse | null;
  isLoading: boolean;
}

export const AlgorithmicVariationsTab: React.FC<AlgorithmicVariationsTabProps> = ({
  data,
  isLoading,
}) => {
  const [selectedSubView, setSelectedSubView] = useState<"all" | "sma" | "weighted" | "nps">("all");
  const [smaWindow, setSmaWindow] = useState<7 | 3>(7);

  if (isLoading || !data) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Calculating algorithmic variations and statistical models...
        </p>
      </div>
    );
  }

  const {
    time_series,
    weighted_sentiment,
    estimated_nps,
    latest_sma7,
    latest_daily,
    comparison_matrix,
  } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent border border-purple-200/60 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-600 text-white">
                <Layers className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Algorithmic Perception Variations
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Different mathematical lenses applied to the <em>same underlying customer review stream</em>. Compare how temporal smoothing, qualitative weighting, and extreme probability clustering reveal distinct dimensions of brand perception.
            </p>
          </div>

          {/* Subview pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setSelectedSubView("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedSubView === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              All Variations
            </button>
            <button
              onClick={() => setSelectedSubView("sma")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedSubView === "sma"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              7-Day SMA
            </button>
            <button
              onClick={() => setSelectedSubView("weighted")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedSubView === "weighted"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Weighted Score
            </button>
            <button
              onClick={() => setSelectedSubView("nps")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedSubView === "nps"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Estimated NPS
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Method Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Method 1: 7-Day Simple Moving Average */}
        <div
          onClick={() => setSelectedSubView("sma")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedSubView === "sma" || selectedSubView === "all"
              ? "bg-white dark:bg-slate-900 border-purple-300 dark:border-purple-800 ring-2 ring-purple-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Method 1: Rolling SMA
            </span>
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              7-Day Rolling Window
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {latest_sma7}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Latest Daily Score:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {latest_daily}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Smoothing Effect:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Removes Day-to-Day Noise
              </span>
            </div>
          </div>
        </div>

        {/* Method 2: Weighted Sentiment Score */}
        <div
          onClick={() => setSelectedSubView("weighted")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedSubView === "weighted" || selectedSubView === "all"
              ? "bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Method 2: Weighted Score
            </span>
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Verified & Length Multipliers
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {weighted_sentiment.weighted_score}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ 100</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {weighted_sentiment.delta >= 0 ? `+${weighted_sentiment.delta}` : weighted_sentiment.delta} vs raw
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Unweighted Baseline:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {weighted_sentiment.unweighted_score}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Verified Buyer Gap:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{weighted_sentiment.verified_gap} pts
              </span>
            </div>
          </div>
        </div>

        {/* Method 3: Estimated Net Promoter Score */}
        <div
          onClick={() => setSelectedSubView("nps")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
            selectedSubView === "nps" || selectedSubView === "all"
              ? "bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Method 3: Estimated NPS
            </span>
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Probability Extremes Polarity
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {estimated_nps.nps_score > 0 ? `+${estimated_nps.nps_score}` : estimated_nps.nps_score}
              </span>
              <span className="text-xs font-semibold text-slate-500">(-100 to +100)</span>
              <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {estimated_nps.tier}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Promoters vs Detractors:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {estimated_nps.promoters_pct}% vs {estimated_nps.detractors_pct}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Passives (Filtered):</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {estimated_nps.passives_pct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL 1: Simple Moving Average (SMA) Deep Dive */}
      {(selectedSubView === "all" || selectedSubView === "sma") && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Method 1: Simple Moving Average (SMA) Rolling Window
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Compares raw daily volatility against smoothed rolling averages to decouple transient noise from sustained trend shifts.
              </p>
            </div>

            {/* SMA window selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Window:</span>
              <button
                onClick={() => setSmaWindow(7)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                  smaWindow === 7
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                7-Day Rolling (Standard)
              </button>
              <button
                onClick={() => setSmaWindow(3)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                  smaWindow === 3
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                3-Day Rolling (Fast)
              </button>
            </div>
          </div>

          {/* SMA Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: "rgba(100, 116, 139, 0.9)" }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                />
                <YAxis
                  domain={[30, 95]}
                  tick={{ fontSize: 11, fill: "rgba(100, 116, 139, 0.9)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                            {item.date}
                          </p>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Daily Raw Score:</span>
                            <span className="font-semibold text-slate-300">{item.dailySentiment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-400">7-Day Rolling SMA:</span>
                            <span className="font-semibold text-purple-400">{item.sma7}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyan-400">3-Day Rolling SMA:</span>
                            <span className="font-semibold text-cyan-400">{item.sma3}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="dailySentiment"
                  name="Raw Daily Sentiment (Volatile)"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey={smaWindow === 7 ? "sma7" : "sma3"}
                  name={smaWindow === 7 ? "7-Day Simple Moving Average" : "3-Day Simple Moving Average"}
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Mathematical explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/60 space-y-2">
              <h4 className="font-bold text-purple-900 dark:text-purple-200">
                Formula & Mathematical Mechanics
              </h4>
              <p className="font-mono text-purple-800 dark:text-purple-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-900">
                SMA_7(t) = (1 / 7) * ∑ [i=0..6] DailySentiment(t - i)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Each point averages the current day with the preceding 6 days. As older days drop off the window, the line shifts smoothly without erratic jagged spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                Executive Actionability
              </h4>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Prevents over-reaction to single unhappy customer posts on slow days.</li>
                <li>Clear momentum signal: if the SMA-7 line crosses below 60, systemic product issues are occurring.</li>
                <li>Ideal for weekly executive summaries and board decks.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL 2: Weighted Sentiment Score Deep Dive */}
      {(selectedSubView === "all" || selectedSubView === "weighted") && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Method 2: Multi-Factor Weighted Sentiment Score
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Down-weights drive-by 1-word reviews and unverified accounts while boosting verified purchases and detailed qualitative feedback.
            </p>
          </div>

          {/* Comparison Cards: Unweighted vs Weighted */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Unweighted Standard Mean
              </span>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                {weighted_sentiment.unweighted_score}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Treats every 3-word review identically to a 200-word verified review.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase">
                Weighted Perception Score
              </span>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {weighted_sentiment.weighted_score}
              </div>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-300 mt-1 font-semibold">
                Delta: {weighted_sentiment.delta >= 0 ? `+${weighted_sentiment.delta}` : weighted_sentiment.delta} points ({weighted_sentiment.delta_percent}%)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
                Verified vs Unverified Gap
              </span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                +{weighted_sentiment.verified_gap}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                Verified: {weighted_sentiment.verified_avg} vs Unverified: {weighted_sentiment.unverified_avg}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase">
                Length In-Depth Gap
              </span>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                +{weighted_sentiment.length_gap}
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                Long (&gt;40 words): {weighted_sentiment.long_reviews_avg} vs Short: {weighted_sentiment.short_reviews_avg}
              </p>
            </div>
          </div>

          {/* Formula Breakdown */}
          <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Multiplier Coefficients Applied
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  1. Verified Purchase Multiplier
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                  1.35x Multiplier
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Verified buyers who completed a validated checkout receive 35% higher weight in overall score calculation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  2. Review Length / Depth Multiplier
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                  Up to 1.50x Multiplier
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Scaled proportionally with word count (1.0 + min(0.5, word_count / 80 * 0.5)), favoring descriptive evaluations.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  3. Community Helpful Votes Multiplier
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                  Up to 1.20x Multiplier
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Logarithmically boosted by votes, rewarding peer-affirmed customer evaluations.
                </p>
              </div>
            </div>
          </div>

          {/* Sample Reviews Weights Table */}
          <div className="overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Sample Reviews with Multipliers Applied:
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-2 px-3 font-semibold">Author</th>
                  <th className="py-2 px-3 font-semibold">Base Score</th>
                  <th className="py-2 px-3 font-semibold">Verified</th>
                  <th className="py-2 px-3 font-semibold">Words</th>
                  <th className="py-2 px-3 font-semibold">Length Mult</th>
                  <th className="py-2 px-3 font-semibold">Verified Mult</th>
                  <th className="py-2 px-3 font-semibold">Total Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {weighted_sentiment.sample_reviews.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {s.author}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {s.score}
                    </td>
                    <td className="py-2 px-3">
                      {s.is_verified ? (
                        <span className="text-emerald-600 font-semibold">✓ Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      {s.word_count}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {s.m_length}x
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {s.m_verified}x
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {s.weight}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL 3: Estimated Net Promoter Score (NPS) Deep Dive */}
      {(selectedSubView === "all" || selectedSubView === "nps") && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Method 3: Estimated Net Promoter Score (NPS) from Probability Extremes
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Directly translates ML classification posteriors into organic customer advocacy tiers without intrusive pop-up surveys.
            </p>
          </div>

          {/* NPS Meter & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* NPS Hero Gauge */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/40 text-center flex flex-col justify-center items-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Net Promoter Score (eNPS)
              </span>
              <div className="text-5xl font-black text-white tracking-tight">
                {estimated_nps.nps_score > 0 ? `+${estimated_nps.nps_score}` : estimated_nps.nps_score}
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {estimated_nps.tier} Tier
              </span>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                {estimated_nps.tier_desc}
              </p>
            </div>

            {/* Distribution Bar & Percentages */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    Promoters ({estimated_nps.promoters_pct}%)
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    Passives ({estimated_nps.passives_pct}%)
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    Detractors ({estimated_nps.detractors_pct}%)
                  </span>
                </div>

                {/* Triple Stacked Bar */}
                <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
                  <div
                    className="bg-emerald-500 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all duration-500"
                    style={{ width: `${estimated_nps.promoters_pct}%` }}
                  >
                    {estimated_nps.promoters_pct}%
                  </div>
                  <div
                    className="bg-amber-400 h-full flex items-center justify-center text-[11px] font-bold text-slate-900 transition-all duration-500"
                    style={{ width: `${estimated_nps.passives_pct}%` }}
                  >
                    {estimated_nps.passives_pct}%
                  </div>
                  <div
                    className="bg-rose-500 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all duration-500"
                    style={{ width: `${estimated_nps.detractors_pct}%` }}
                  >
                    {estimated_nps.detractors_pct}%
                  </div>
                </div>
              </div>

              {/* Threshold Definition Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    Promoter Criteria
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    P(Positive) ≥ 0.60 or P(Pos) - P(Neg) ≥ 0.35. High likelihood of word-of-mouth referral.
                  </p>
                  <div className="mt-2 font-bold text-emerald-700 dark:text-emerald-400">
                    {estimated_nps.promoters_count} reviews
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    Passive Criteria
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    Balanced or moderate sentiment probabilities. Satisfied but vulnerable to competitor offers.
                  </p>
                  <div className="mt-2 font-bold text-amber-700 dark:text-amber-400">
                    {estimated_nps.passives_count} reviews
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                  <div className="font-bold text-rose-800 dark:text-rose-300">
                    Detractor Criteria
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    P(Negative) ≥ 0.50 or P(Neg) - P(Pos) ≥ 0.30. Unhappy customers who spread brand degradation.
                  </p>
                  <div className="mt-2 font-bold text-rose-700 dark:text-rose-400">
                    {estimated_nps.detractors_count} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED COMPARATIVE MATRIX TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Algorithmic Variations Comparative Matrix
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Direct side-by-side contrast of perception methodologies to guide reporting and strategic product decisions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-3 px-4 font-semibold">Perception Algorithm</th>
                <th className="py-3 px-4 font-semibold">Computed Score</th>
                <th className="py-3 px-4 font-semibold">Scale</th>
                <th className="py-3 px-4 font-semibold">Noise Immunity</th>
                <th className="py-3 px-4 font-semibold">Spam/Bot Resistance</th>
                <th className="py-3 px-4 font-semibold">Recommended Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparison_matrix.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 max-w-xs">
                      {m.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {m.id === "nps" && m.score > 0 ? `+${m.score}` : m.score}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                    {m.scale}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {m.sensitivityToOutliers}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {m.biasMitigation}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {m.primaryUse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
