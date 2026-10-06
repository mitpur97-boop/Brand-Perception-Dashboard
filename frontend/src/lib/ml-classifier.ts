import weightsData from "./ml-weights.json";

export interface MLPrediction {
  sentiment: "Positive" | "Neutral" | "Negative";
  probabilities: {
    Positive: number;
    Neutral: number;
    Negative: number;
  };
  confidence: number;
  score: number;
  normalized_score: number;
}

const { classes, vocabulary, idf, coef, intercept } = weightsData as {
  classes: string[];
  vocabulary: Record<string, number>;
  idf: number[];
  coef: number[][];
  intercept: number[];
};

export function classifyText(text: string): MLPrediction {
  if (!text || !text.trim()) {
    return {
      sentiment: "Neutral",
      probabilities: { Positive: 0.333, Neutral: 0.334, Negative: 0.333 },
      confidence: 0.334,
      score: 0.0,
      normalized_score: 50.0,
    };
  }

  // Tokenize
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = clean.split(" ").filter((t) => t.length > 0);

  // Extract unigrams and bigrams
  const ngrams: string[] = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    ngrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }

  // Term frequencies
  const tfMap = new Map<number, number>();
  for (const gram of ngrams) {
    if (vocabulary[gram] !== undefined) {
      const idx = vocabulary[gram];
      tfMap.set(idx, (tfMap.get(idx) || 0) + 1);
    }
  }

  // TF-IDF with sublinear tf
  const numFeatures = idf.length;
  let normSq = 0;
  const featureVector: { idx: number; val: number }[] = [];

  tfMap.forEach((count, idx) => {
    const tf = 1 + Math.log(count);
    const tfidfVal = tf * idf[idx];
    featureVector.push({ idx, val: tfidfVal });
    normSq += tfidfVal * tfidfVal;
  });

  const norm = Math.sqrt(normSq) || 1.0;
  for (const feat of featureVector) {
    feat.val /= norm;
  }

  // Logistic Regression scores for each class
  const classScores: number[] = [];
  for (let c = 0; c < classes.length; c++) {
    let z = intercept[c];
    for (const feat of featureVector) {
      z += feat.val * coef[c][feat.idx];
    }
    classScores.push(z);
  }

  // Softmax
  const maxScore = Math.max(...classScores);
  const exps = classScores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const probas = exps.map((e) => e / sumExp);

  const probDict: Record<string, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  classes.forEach((className, i) => {
    probDict[className] = Math.round(probas[i] * 10000) / 10000;
  });

  // Predicted class
  let predSentiment: "Positive" | "Neutral" | "Negative" = "Neutral";
  let maxP = -1;
  (["Positive", "Neutral", "Negative"] as const).forEach((c) => {
    if (probDict[c] > maxP) {
      maxP = probDict[c];
      predSentiment = c;
    }
  });

  const continuousScore = Math.round((probDict.Positive - probDict.Negative) * 10000) / 10000;
  const normalizedScore = Math.round((continuousScore + 1.0) * 5000) / 100;

  return {
    sentiment: predSentiment,
    probabilities: {
      Positive: probDict.Positive,
      Neutral: probDict.Neutral,
      Negative: probDict.Negative,
    },
    confidence: maxP,
    score: continuousScore,
    normalized_score: normalizedScore,
  };
}
