"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { OverviewTab } from "@/components/OverviewTab";
import { ReviewsTab } from "@/components/ReviewsTab";
import { AlgorithmicVariationsTab } from "@/components/AlgorithmicVariationsTab";
import { LiveClassifierModal } from "@/components/LiveClassifierModal";
import {
  fetchOverviewAnalytics,
  fetchAlgorithmicVariations,
  fetchReviews,
  submitNewReview,
  resetSeedReviews,
  fetchHealth
} from "@/lib/api";
import {
  OverviewAnalyticsResponse,
  AlgorithmicVariationsResponse,
  Review
} from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "algorithms">("overview");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLiveTestOpen, setIsLiveTestOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [overviewData, setOverviewData] = useState<OverviewAnalyticsResponse | null>(null);
  const [variationsData, setVariationsData] = useState<AlgorithmicVariationsResponse | null>(null);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  // Initialize theme from system or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("brandpulse_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("brandpulse_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("brandpulse_theme", "light");
      }
      return next;
    });
  };

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check health
      try {
        const health = await fetchHealth();
        if (health && health.status === "healthy") {
          setBackendOnline(true);
        }
      } catch (e) {
        console.warn("Backend not immediately responsive, attempting direct fetches...");
      }

      // Parallel fetching
      const [overviewRes, variationsRes, reviewsRes] = await Promise.all([
        fetchOverviewAnalytics(),
        fetchAlgorithmicVariations(),
        fetchReviews({ limit: 100 }),
      ]);

      setOverviewData(overviewRes);
      setVariationsData(variationsRes);
      setReviewsList(reviewsRes.reviews || []);
      setBackendOnline(true);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle adding new review
  const handleAddNewReview = async (review: {
    text: string;
    author: string;
    rating: number;
    is_verified: boolean;
    channel: string;
  }) => {
    try {
      await submitNewReview(review);
      // Reload overview, variations, and review feed
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  // Handle resetting data
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetSeedReviews();
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to reset:", err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenLiveTest={() => setIsLiveTestOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
        totalReviews={reviewsList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-slate-500 dark:text-slate-400">
              ML Inference Pipeline:{" "}
              <strong className={backendOnline ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}>
                {backendOnline ? "Online (TF-IDF + Calibrated Logistic Regression)" : "Connecting..."}
              </strong>
            </span>
          </div>

          <div className="text-slate-400 dark:text-slate-500 text-[11px]">
            Brand: <strong>KarghaKendra Artisan Collection</strong> • 30-Day Evaluation Window
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            data={overviewData}
            isLoading={isLoading}
            onNavigateToReviews={() => setActiveTab("reviews")}
            onNavigateToAlgorithms={() => setActiveTab("algorithms")}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab
            reviews={reviewsList}
            isLoading={isLoading}
            onAddNewReview={handleAddNewReview}
          />
        )}

        {activeTab === "algorithms" && (
          <AlgorithmicVariationsTab
            data={variationsData}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BrandPulse • Brand Perception Monitoring Platform</span>
          <div className="flex items-center gap-3">
            <span>Supervised Sentiment Analysis</span>
            <span>•</span>
            <span>7-Day SMA</span>
            <span>•</span>
            <span>Weighted Scoring</span>
            <span>•</span>
            <span>Estimated NPS</span>
          </div>
        </div>
      </footer>

      {/* Live Classifier Modal */}
      <LiveClassifierModal
        isOpen={isLiveTestOpen}
        onClose={() => setIsLiveTestOpen(false)}
        onAddReviewToStream={handleAddNewReview}
      />
    </div>
  );
}
