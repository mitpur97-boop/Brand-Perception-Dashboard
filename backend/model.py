"""
Supervised Sentiment Analysis Model for Customer Reviews
Uses TF-IDF feature extraction with Logistic Regression to classify reviews
into Positive, Neutral, and Negative categories with calibrated probabilities.
"""

import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Comprehensive labeled training corpus to ensure high generalization accuracy
TRAINING_DATA = [
    # --- POSITIVE SAMPLES ---
    ("Absolutely fantastic product! Exceeded all my expectations in every way.", "Positive"),
    ("Best purchase I have made all year. Outstanding quality and finish.", "Positive"),
    ("Customer support was phenomenal and resolved my question within minutes.", "Positive"),
    ("Arrived early, beautifully packaged, and works like a dream. Highly recommend!", "Positive"),
    ("Remarkable craftsmanship, durable materials, and intuitive interface.", "Positive"),
    ("I love everything about this brand. They truly care about user experience.", "Positive"),
    ("Impressed with the speed and reliability. Will definitely buy again.", "Positive"),
    ("Five stars! Seamless onboarding, top-tier performance, and great battery life.", "Positive"),
    ("The new update fixed all previous complaints. Truly listening to community feedback.", "Positive"),
    ("Super easy to set up and very user friendly. My whole team is thrilled.", "Positive"),
    ("Exceptional value for the money. You cannot find better at this price point.", "Positive"),
    ("Sleek, modern, and sturdy. Delivers on every promise made on the website.", "Positive"),
    ("Genuinely delighted with this order. Quick dispatch and friendly service.", "Positive"),
    ("A breath of fresh air. Well-designed, reliable, and delightful to use.", "Positive"),
    ("Incredible customer journey from checkout to unboxing. Flawless execution.", "Positive"),
    ("Very happy with the build quality. Exceeds higher priced competitors.", "Positive"),
    ("Works flawlessly right out of the box. Couldn't ask for a better experience.", "Positive"),
    ("Superb attention to detail and premium feel. Worth every single penny.", "Positive"),
    ("Brilliant idea, brilliantly executed. Has saved me hours each week.", "Positive"),
    ("Responsive team, great warranty, and high quality components.", "Positive"),
    ("The product is wonderful, sleek and durable. Love it!", "Positive"),
    ("Great customer service, they replaced my damaged item within 24 hours.", "Positive"),
    ("Very intuitive design and very pleasing aesthetic.", "Positive"),
    ("I'm so glad I decided to purchase this. Complete game changer.", "Positive"),
    ("High quality fabric and stitching, authentic handloom texture.", "Positive"),
    ("Stunning colors and exactly matches the catalog pictures.", "Positive"),
    ("Comfortable, stylish, and ethical production. Proud to support this brand.", "Positive"),
    ("The delivery was swift and the packaging was eco-friendly and neat.", "Positive"),
    ("Very solid performance with no issues whatsoever.", "Positive"),
    ("Smooth experience from start to finish. Highly commendable.", "Positive"),
    ("The battery easily lasts two full days on moderate usage. Very satisfied.", "Positive"),
    ("Impressive responsiveness and clean navigation.", "Positive"),
    ("Great build, premium finish, and wonderful user satisfaction.", "Positive"),
    ("Surpassed expectations! Such prompt communication and care.", "Positive"),
    ("Definite recommendation to all my friends and family.", "Positive"),
    ("Top notch quality and unbeatable customer attention.", "Positive"),
    ("A total pleasure to use on a daily basis.", "Positive"),
    ("Splendid craftsmanship that honors traditional techniques with modern flair.", "Positive"),
    ("Everything described was completely accurate and even better in person.", "Positive"),
    ("I cannot recommend this enough. Pure delight.", "Positive"),

    # --- NEUTRAL SAMPLES ---
    ("The product arrived in standard packaging. Functions as described in the manual.", "Neutral"),
    ("Average performance. It is neither particularly great nor bad.", "Neutral"),
    ("Does the job, but nothing extraordinary compared to other options.", "Neutral"),
    ("Delivery took 4 business days as estimated during checkout.", "Neutral"),
    ("Standard specifications and plastic build. Meets basic requirements.", "Neutral"),
    ("It works okay. Took some time to figure out the settings.", "Neutral"),
    ("Item matches the dimensions specified in the product specs.", "Neutral"),
    ("Fair pricing for what you get, nothing more and nothing less.", "Neutral"),
    ("Neutral experience overall. Customer service responded within the standard SLA.", "Neutral"),
    ("Used it for two weeks now. Operates within expected parameters.", "Neutral"),
    ("The color is slightly darker than the screen photo, but acceptable.", "Neutral"),
    ("Mediocre experience. Neither impressed nor deeply disappointed.", "Neutral"),
    ("Functions fine for simple tasks, though power users might need more.", "Neutral"),
    ("Received the package today. Unboxed and tested the basic features.", "Neutral"),
    ("Satisfactory for everyday casual use. Average battery longevity.", "Neutral"),
    ("It is an ordinary device with standard capabilities.", "Neutral"),
    ("The manual is in multiple languages and covers basic operation.", "Neutral"),
    ("Shipping speed was neither fast nor delayed. Exactly on the scheduled date.", "Neutral"),
    ("Some features are convenient, others feel slightly redundant.", "Neutral"),
    ("Neither good nor bad. Just a typical utility tool.", "Neutral"),
    ("Decent cotton material. Nothing fancy, but works for daily wear.", "Neutral"),
    ("Standard sizing, fits as expected according to the size chart.", "Neutral"),
    ("The software interface is fairly plain and straightforward.", "Neutral"),
    ("Contains the accessories mentioned in the product description.", "Neutral"),
    ("Average quality, acceptable durability for routine usage.", "Neutral"),
    ("No major issues encountered, but nothing stood out as exceptional.", "Neutral"),
    ("Replaced an older unit. Operates at roughly the same level.", "Neutral"),
    ("It is adequate for basic requirements.", "Neutral"),
    ("Moderate weight and standard ergonomic design.", "Neutral"),
    ("Fair quality. Let's see how well it holds up over the coming months.", "Neutral"),
    ("It performs as advertised without any extra perks.", "Neutral"),
    ("A standard offering in this category. Typical price-to-performance.", "Neutral"),
    ("Arrived on schedule. Basic functionality checked out fine.", "Neutral"),
    ("Nothing special to report. Works as intended.", "Neutral"),
    ("Standard return policy applies. Item arrived safely.", "Neutral"),

    # --- NEGATIVE SAMPLES ---
    ("Terrible quality. Broke within three days of normal usage.", "Negative"),
    ("Very disappointed with the customer support. They refused to help or refund.", "Negative"),
    ("Do not buy this! Cheap plastic, misleading photos, and horrible smell.", "Negative"),
    ("Worst purchase experience ever. Package arrived damaged and two weeks late.", "Negative"),
    ("The app crashes constantly and drains battery life rapidly. Extremely frustrating.", "Negative"),
    ("Total waste of money. The item does not work as advertised at all.", "Negative"),
    ("Unresponsive customer care and confusing return process. Avoid this brand.", "Negative"),
    ("Fell apart on first wash. Poor stitching and cheap fabric.", "Negative"),
    ("Completely unacceptable quality control. Received a defective unit twice.", "Negative"),
    ("Full of bugs, glitches, and unexpected shutdowns. Regret buying.", "Negative"),
    ("Misleading marketing! The actual product looks nothing like the promotional images.", "Negative"),
    ("Lacks basic functionality and feels flimsy. Definite zero stars if I could.", "Negative"),
    ("Rude support agents and hidden extra fees during returns.", "Negative"),
    ("Extremely loud fan noise and constant overheating issues.", "Negative"),
    ("Very cheap materials used. Expected much better for this price.", "Negative"),
    ("Delivery was delayed by over two weeks with zero communication from support.", "Negative"),
    ("Stopped charging after just one week. Complete lemon.", "Negative"),
    ("Frustrating setup experience with confusing error messages everywhere.", "Negative"),
    ("Subpar performance and frequent disconnections. Very dissatisfied.", "Negative"),
    ("Poor design choices that make simple tasks cumbersome and irritating.", "Negative"),
    ("Color faded after single wash. Shrinkage was severe.", "Negative"),
    ("Defective buttons, unresponsive touchscreen, and sluggish software.", "Negative"),
    ("Shockingly poor service. They ghosted my emails regarding the replacement.", "Negative"),
    ("Not recommended. Low durability and awful customer aftercare.", "Negative"),
    ("I feel cheated by the false specifications listed on the website.", "Negative"),
    ("Overpriced junk that failed within a month.", "Negative"),
    ("Very poor build quality with loose joints and scratches out of box.", "Negative"),
    ("Constant lag, terrible latency, and unhelpful documentation.", "Negative"),
    ("Terrible return experience. Charged me return shipping for a broken unit.", "Negative"),
    ("Horrendous customer support. Waited 45 minutes on hold only to be disconnected.", "Negative"),
    ("Fails to meet even the bare minimum requirements.", "Negative"),
    ("Extremely brittle plastic. Snapped when applying gentle pressure.", "Negative"),
    ("Completely ruined my project due to faulty output and wrong calibration.", "Negative"),
    ("Avoid at all costs. Shoddy craftsmanship and deceptive company policies.", "Negative"),
    ("Deeply regret this order. Nothing works properly.", "Negative"),
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "sentiment_model.joblib")


class SentimentClassifier:
    """
    Supervised sentiment analysis pipeline outputting class probabilities
    for Positive, Neutral, and Negative sentiments.
    """

    def __init__(self):
        self.pipeline: Pipeline | None = None
        self.classes = ["Negative", "Neutral", "Positive"]
        self._load_or_train()

    def _train(self):
        texts = [x[0] for x in TRAINING_DATA]
        labels = [x[1] for x in TRAINING_DATA]

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                sublinear_tf=True,
                max_features=8000,
                strip_accents="unicode",
                lowercase=True,
                min_df=1
            )),
            ("clf", LogisticRegression(
                C=3.5,
                max_iter=1000,
                class_weight="balanced",
                solver="lbfgs"
            ))
        ])

        pipeline.fit(texts, labels)
        self.pipeline = pipeline
        try:
            joblib.dump(pipeline, MODEL_PATH)
        except Exception:
            pass

    def _load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.pipeline = joblib.load(MODEL_PATH)
                return
            except Exception:
                pass
        self._train()

    def predict(self, text: str) -> dict:
        """
        Classifies review text and returns sentiment, probabilities, and scores.
        """
        if not text or not text.strip():
            return {
                "sentiment": "Neutral",
                "probabilities": {"Positive": 0.333, "Neutral": 0.334, "Negative": 0.333},
                "confidence": 0.334,
                "score": 0.0,
                "normalized_score": 50.0
            }

        clf = self.pipeline
        if clf is None:
            self._train()
            clf = self.pipeline

        # Get probability estimates
        probas = clf.predict_proba([text])[0]
        class_names = list(clf.classes_)

        prob_dict = {}
        for c in ["Positive", "Neutral", "Negative"]:
            if c in class_names:
                prob_dict[c] = float(np.round(probas[class_names.index(c)], 4))
            else:
                prob_dict[c] = 0.0

        # Primary sentiment prediction
        pred_sentiment = max(prob_dict, key=prob_dict.get)
        confidence = float(prob_dict[pred_sentiment])

        # Continuous sentiment score from -1.0 (strongly negative) to +1.0 (strongly positive)
        # Using expected sentiment value: +1 * P(Positive) + 0 * P(Neutral) - 1 * P(Negative)
        continuous_score = float(np.round(prob_dict["Positive"] - prob_dict["Negative"], 4))
        # 0 to 100 normalized score
        normalized_score = float(np.round((continuous_score + 1.0) * 50.0, 2))

        return {
            "sentiment": pred_sentiment,
            "probabilities": prob_dict,
            "confidence": confidence,
            "score": continuous_score,
            "normalized_score": normalized_score
        }

    def predict_batch(self, texts: list[str]) -> list[dict]:
        return [self.predict(t) for t in texts]


# Singleton instance
classifier = SentimentClassifier()
