"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  ArrowRight
} from "lucide-react";
import { predictSentiment } from "@/lib/api";
import { PredictResponse } from "@/lib/types";

interface LiveClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReviewToStream: (review: {
    text: string;
    author: string;
    rating: number;
    is_verified: boolean;
    channel: string;
  }) => Promise<void>;
}

export const LiveClassifierModal: React.FC<LiveClassifierModalProps> = ({
  isOpen,
  onClose,
  onAddReviewToStream,
}) => {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Guest Reviewer");
  const [rating, setRating] = useState(5);
  const [channel, setChannel] = useState("Amazon");
  const [isVerified, setIsVerified] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClassify = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAddedSuccess(false);
    try {
      const res = await predictSentiment(text);
      setResult(res);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAndClose = async () => {
    if (!text.trim()) return;
    setIsAdding(true);
    try {
      await onAddReviewToStream({
        text,
        author: author || "Guest Reviewer",
        rating,
        is_verified: isVerified,
        channel,
      });
      setAddedSuccess(true);
      setTimeout(() => {
        onClose();
        setText("");
        setResult(null);
        setAddedSuccess(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const samplePrompts = [
    "Phenomenal craftsmanship, beautiful natural indigo dye, and delivered within 2 days!",
    "Item arrived as specified in standard box. Fits standard dimensions.",
    "Broke after two days of light use. Customer service refused my refund request. Terrible!",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live ML Sentiment Inference Tester
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Run raw customer feedback through the supervised TF-IDF + Logistic Regression model.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick Test Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(sample)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition truncate max-w-xs text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any customer review text here..."
            className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          <div className="flex justify-end">
            <button
              onClick={handleClassify}
              disabled={isLoading || !text.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Inferring..." : "Classify with ML"}</span>
            </button>
          </div>
        </div>

        {/* Inference Results Display */}
        {result && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Predicted Class:</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    result.sentiment === "Positive"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                      : result.sentiment === "Neutral"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300"
                      : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300"
                  }`}
                >
                  {result.sentiment}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Confidence: {Math.round(result.confidence * 100)}%
                </span>
                <span className="font-mono text-slate-500">
                  Normalized Score: {result.normalized_score} / 100
                </span>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Classification Posterior Probabilities
              </span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-0.5">
                    <span>Positive</span>
                    <span className="font-semibold">
                      {Math.round((result.probabilities.Positive || 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((result.probabilities.Positive || 0) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-0.5">
                    <span>Neutral</span>
                    <span className="font-semibold">
                      {Math.round((result.probabilities.Neutral || 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((result.probabilities.Neutral || 0) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-0.5">
                    <span>Negative</span>
                    <span className="font-semibold">
                      {Math.round((result.probabilities.Negative || 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((result.probabilities.Negative || 0) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Append to stream */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Reviewer Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Trustpilot">Trustpilot</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Google Reviews">Google Reviews</option>
                  <option value="Twitter/X">Twitter/X</option>
                </select>
              </div>

              <button
                onClick={handleAddAndClose}
                disabled={isAdding || addedSuccess}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>Added to Dashboard!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAdding ? "Adding..." : "Add to Dashboard Stream"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
