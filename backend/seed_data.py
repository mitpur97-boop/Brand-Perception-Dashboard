"""
Mock Seed Dataset containing 65+ realistic, varied customer reviews
spanning different lengths, sentiments, ratings, sources, and verified states across the last 30 days.
"""

from datetime import datetime, timedelta
import random

RAW_REVIEWS = [
    # Positive - Long & Detailed
    {
        "author": "Sarah Jenkins",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 34,
        "days_ago": 1,
        "text": "I have been using KarghaKendra's artisan handloom collection for over three months now, and the craftsmanship is simply breathtaking. The organic cotton feels exceptionally soft yet durable, and the natural indigo dye hasn't faded even after several gentle washes. Knowing that my purchase directly empowers traditional weaver clusters makes this feel far more valuable than standard fast-fashion purchases. Customer support was also incredibly thoughtful when I had a sizing inquiry. 10/10 recommendation!"
    },
    {
        "author": "Michael Chang",
        "rating": 5,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 21,
        "days_ago": 2,
        "text": "Outstanding build quality and fast international delivery. The parcel arrived in sustainable packaging within four business days. The attention to detail in the seam finishing and the woven motifs truly stands out. Customer service went above and beyond when I needed to update my delivery address post-checkout. Will definitely be a returning patron."
    },
    {
        "author": "Priya Sharma",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 18,
        "days_ago": 3,
        "text": "Exceeded all expectations! The authentic hand-spun texture and radiant colors are even richer in person than on the catalog website. My family was thoroughly impressed during the festive season. Remarkable brand mission and flawless fulfillment."
    },
    {
        "author": "David Miller",
        "rating": 5,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 12,
        "days_ago": 4,
        "text": "Hands down the best ethical lifestyle brand I have discovered this year. Top tier quality, transparent artisan stories, and genuine cultural appreciation. Kudos to the founders!"
    },
    {
        "author": "Elena Rostova",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 15,
        "days_ago": 5,
        "text": "Phenomenal experience from start to finish. The website was smooth, checkout took 30 seconds, and the parcel reached Berlin without customs delay. The fabric drape and weight are perfect for autumn. Absolutely ecstatic with this acquisition."
    },
    # Positive - Medium & Short
    {
        "author": "Amit Patel",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 8,
        "days_ago": 6,
        "text": "High quality fabric and stitching, authentic handloom texture. Truly happy with my purchase."
    },
    {
        "author": "Jessica Taylor",
        "rating": 5,
        "is_verified": False,
        "channel": "App Store",
        "helpful_votes": 5,
        "days_ago": 7,
        "text": "The mobile app experience is super slick, clean, and intuitive. Great order tracking updates too."
    },
    {
        "author": "Carlos Gomez",
        "rating": 4,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 9,
        "days_ago": 8,
        "text": "Very solid quality and comfortable drape. Arrived a day earlier than projected. A wonderful gift."
    },
    {
        "author": "Aisha Al-Mansoor",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 11,
        "days_ago": 9,
        "text": "Remarkable elegance! Everyone at our gathering asked where I got this piece. Absolutely worth every penny."
    },
    {
        "author": "Liam O'Connor",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 7,
        "days_ago": 10,
        "text": "Best customer support I have encountered in a long time. They swiftly replaced a slightly mismatched belt within 24 hours."
    },
    {
        "author": "Sophie Martin",
        "rating": 4,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 4,
        "days_ago": 11,
        "text": "Really impressed by the tactile feel of the weaving. Premium materials and nice aesthetic!"
    },
    {
        "author": "Vikram Sen",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 6,
        "days_ago": 12,
        "text": "Fantastic value for money. Authentic weaving at an honest price."
    },
    {
        "author": "Hannah Weber",
        "rating": 5,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 10,
        "days_ago": 13,
        "text": "Five stars! Seamless onboarding, top-tier performance, and great durability."
    },
    {
        "author": "Rahul Nair",
        "rating": 4,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 3,
        "days_ago": 14,
        "text": "Smooth app navigation and prompt push notifications regarding shipping milestones."
    },
    {
        "author": "Clara Dupont",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 14,
        "days_ago": 15,
        "text": "A total pleasure to use on a daily basis. The design language is poetic yet modern."
    },
    {
        "author": "George K.",
        "rating": 5,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 2,
        "days_ago": 16,
        "text": "Splendid craftsmanship that honors traditional techniques with modern flair. Loved it!"
    },
    {
        "author": "Ananya Joshi",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 13,
        "days_ago": 17,
        "text": "Pure delight. Beautifully packed, lovely handwritten artisan thank you note, and pristine fabric."
    },
    {
        "author": "Lucas Silva",
        "rating": 4,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 5,
        "days_ago": 18,
        "text": "Good experience overall. Fabric is soft, breathable, and holds up well after wash."
    },
    {
        "author": "Rachel Green",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 9,
        "days_ago": 19,
        "text": "Impressed with the speed and reliability. Will definitely buy again."
    },
    {
        "author": "Tanmay Verma",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 8,
        "days_ago": 20,
        "text": "Genuinely delighted with this order. Quick dispatch and friendly service."
    },

    # Neutral Reviews - Varied lengths & channels
    {
        "author": "Robert Evans",
        "rating": 3,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 16,
        "days_ago": 2,
        "text": "The product arrived in standard packaging. Functions as described in the manual. The color is slightly more muted in reality compared to the high-contrast studio photographs on the website, but acceptable for daily office use. Delivery took 4 business days as estimated during checkout."
    },
    {
        "author": "Sunita Rao",
        "rating": 3,
        "is_verified": False,
        "channel": "Google Reviews",
        "helpful_votes": 7,
        "days_ago": 4,
        "text": "Average performance. It is neither particularly great nor bad. Adequate for routine requirements, but not a luxury item."
    },
    {
        "author": "Brian Cooper",
        "rating": 3,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 11,
        "days_ago": 7,
        "text": "Standard specifications and build. Meets basic requirements without any special fanfare. Fair pricing for what you get."
    },
    {
        "author": "Meera Krishnan",
        "rating": 3,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 5,
        "days_ago": 9,
        "text": "Does the job, but nothing extraordinary compared to other options on the market. Decent cotton material."
    },
    {
        "author": "Felix Bauer",
        "rating": 3,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 3,
        "days_ago": 11,
        "text": "Neutral experience overall. The packaging was okay, delivery on schedule, product works fine."
    },
    {
        "author": "Kavita Reddy",
        "rating": 3,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 6,
        "days_ago": 13,
        "text": "Standard sizing, fits as expected according to the size chart. Average durability for routine wear."
    },
    {
        "author": "Thomas Wright",
        "rating": 3,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 4,
        "days_ago": 15,
        "text": "The mobile app is functional. Some UI elements feel slightly sluggish on older Android hardware, but no breaking bugs."
    },
    {
        "author": "Nadia Popov",
        "rating": 3,
        "is_verified": False,
        "channel": "Trustpilot",
        "helpful_votes": 8,
        "days_ago": 18,
        "text": "Shipping speed was neither fast nor delayed. Exactly on the scheduled date. Basic utility checked out fine."
    },
    {
        "author": "Deepak Mehta",
        "rating": 3,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 6,
        "days_ago": 21,
        "text": "Used it for two weeks now. Operates within expected parameters. Neither impressed nor deeply disappointed."
    },
    {
        "author": "Claire Bennett",
        "rating": 3,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 9,
        "days_ago": 23,
        "text": "Replaced an older unit. Operates at roughly the same level. Mediocre documentation but passable."
    },
    {
        "author": "Arun Pillai",
        "rating": 3,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 2,
        "days_ago": 25,
        "text": "Fair quality. Let's see how well it holds up over the coming months. Nothing special to report."
    },
    {
        "author": "Laura Kim",
        "rating": 3,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 5,
        "days_ago": 27,
        "text": "Standard return policy applies. Item arrived safely in simple corrugated box. Meets specifications."
    },
    {
        "author": "Zane Malik",
        "rating": 3,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 4,
        "days_ago": 29,
        "text": "Does what it says. Push notifications can be slightly redundant, but overall okay."
    },

    # Negative Reviews - Varied lengths & channels
    {
        "author": "Marcus Thorne",
        "rating": 1,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 42,
        "days_ago": 1,
        "text": "Terrible quality control and deeply frustrating customer support experience! The seams unraveled completely along the side hem on the very first gentle wash cycle. When I contacted their customer helpline to request an exchange, the representative was dismissive, refused to acknowledge the defect, and insisted I pay overseas return shipping charges. For a company that touts artisan precision, this is unacceptable negligence."
    },
    {
        "author": "Emily Watson",
        "rating": 1,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 29,
        "days_ago": 3,
        "text": "Do not buy this! Misleading product photos, cheap flimsy texture, and chemical smell upon unboxing. Looks nothing like the premium artisanal imagery depicted on their storefront. Completely disappointed."
    },
    {
        "author": "Rajesh Gupta",
        "rating": 2,
        "is_verified": False,
        "channel": "Google Reviews",
        "helpful_votes": 14,
        "days_ago": 5,
        "text": "Worst purchase experience ever. Package arrived ten days late with zero tracking updates. When it finally arrived, the packaging was crushed and torn. Will never order from here again."
    },
    {
        "author": "Chloe Lefebvre",
        "rating": 1,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 19,
        "days_ago": 8,
        "text": "The app crashes constantly during checkout and drains battery life rapidly. Extremely frustrating trying to apply discount codes. Full of bugs and unexpected freezes."
    },
    {
        "author": "Daniel Becker",
        "rating": 2,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 11,
        "days_ago": 10,
        "text": "Unresponsive customer care and confusing return process. Avoid this brand until they fix their post-sales service."
    },
    {
        "author": "Pooja Hegde",
        "rating": 1,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 25,
        "days_ago": 12,
        "text": "Color faded dramatically after single cold rinse. Severe shrinkage made it completely unwearable. Total waste of money."
    },
    {
        "author": "Arthur Pendelton",
        "rating": 1,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 17,
        "days_ago": 14,
        "text": "Overpriced junk that failed within two weeks. Customer support ghosted my emails regarding a replacement. Terrible service!"
    },
    {
        "author": "Karthik Swamy",
        "rating": 2,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 8,
        "days_ago": 16,
        "text": "Subpar quality and loose threads everywhere out of the box. Expected much better given the glowing influencer endorsements."
    },
    {
        "author": "Jessica Alba M.",
        "rating": 1,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 22,
        "days_ago": 19,
        "text": "Horrendous customer support. Waited 45 minutes on hold only to be disconnected abruptly. No callback received."
    },
    {
        "author": "Siddharth Nair",
        "rating": 2,
        "is_verified": False,
        "channel": "Amazon",
        "helpful_votes": 7,
        "days_ago": 22,
        "text": "Fails to meet even the bare minimum requirements. Shoddy craftsmanship and deceptive company claims."
    },
    {
        "author": "Megan Foxx",
        "rating": 1,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 15,
        "days_ago": 24,
        "text": "Constant lag, recurring payment gateway errors, and unhelpful support bots. Delete and avoid."
    },
    {
        "author": "Oliver Queen",
        "rating": 2,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 10,
        "days_ago": 26,
        "text": "Very poor build quality with scratches on the brass fasteners. Deeply regret this purchase."
    },
    {
        "author": "Fatima Noor",
        "rating": 1,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 13,
        "days_ago": 28,
        "text": "Avoid at all costs! They charge exorbitant restocking fees for items that arrived damaged. Shockingly bad policy."
    },

    # Additional Positive & Balanced Reviews across days 15 to 30 to reach 65+
    {
        "author": "Benjamin Clark",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 14,
        "days_ago": 21,
        "text": "Truly top-notch service! The product arrived neatly gift-wrapped with an individualized artisan bio. Authentic, warm, and sturdy."
    },
    {
        "author": "Anjali Kapoor",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 16,
        "days_ago": 22,
        "text": "I am so glad I gave this boutique a try. The fabric is luxurious, breathable, and ethically sourced. Will buy more for Diwali."
    },
    {
        "author": "Nathan Drake",
        "rating": 4,
        "is_verified": False,
        "channel": "Google Reviews",
        "helpful_votes": 5,
        "days_ago": 23,
        "text": "Reliable craftsmanship and honest representation. Took 5 days to reach, but worth the short wait."
    },
    {
        "author": "Divya Chawla",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 11,
        "days_ago": 24,
        "text": "Stunning colors and exactly matches the catalog pictures. The handloom texture feels genuinely sacred."
    },
    {
        "author": "Samuel Jackson",
        "rating": 4,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 8,
        "days_ago": 25,
        "text": "Good durability and authentic feel. A small snag in packaging was swiftly rectified by team support."
    },
    {
        "author": "Varun Dhawan",
        "rating": 5,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 19,
        "days_ago": 26,
        "text": "Five stars without hesitation. Ethical fashion done right, with uncompromising modern standards."
    },
    {
        "author": "Grace Hopper",
        "rating": 4,
        "is_verified": True,
        "channel": "App Store",
        "helpful_votes": 9,
        "days_ago": 27,
        "text": "Clean user interface, fast checkout, and transparent order tracking notifications."
    },
    {
        "author": "Tariq Aziz",
        "rating": 5,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 6,
        "days_ago": 28,
        "text": "Impressed by the sustainable ethos. Support local weavers and get world-class apparel!"
    },
    {
        "author": "Maya Lin",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 12,
        "days_ago": 29,
        "text": "The feel of pure hand-spun cotton is unmatched. Thank you KarghaKendra for honoring heritage crafts."
    },
    {
        "author": "Kenneth Ross",
        "rating": 4,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 7,
        "days_ago": 30,
        "text": "Solid product, fair price, and eco-friendly packaging. Delighted with the outcome."
    },
    {
        "author": "Sneha Bose",
        "rating": 5,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 14,
        "days_ago": 6,
        "text": "Splendid texture, elegant design, and very courteous customer support. Highly recommended!"
    },
    {
        "author": "Julian Alvarez",
        "rating": 4,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 8,
        "days_ago": 15,
        "text": "Pleasant unboxing, great fabric quality, and feels very gentle on sensitive skin."
    },
    {
        "author": "Shruti Saxena",
        "rating": 5,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 20,
        "days_ago": 4,
        "text": "Exceeded all expectations! The colors are vibrant and the weave is exceptionally fine."
    },
    {
        "author": "Oscar Wilde",
        "rating": 3,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 5,
        "days_ago": 17,
        "text": "Decent product, acceptable delivery time. Nothing particularly outstanding."
    },
    {
        "author": "Ravi Teja",
        "rating": 5,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 11,
        "days_ago": 8,
        "text": "Wonderful authenticity and ethical supply chain. Proud to wear handloom."
    },
    {
        "author": "Isabella Rossi",
        "rating": 4,
        "is_verified": True,
        "channel": "Trustpilot",
        "helpful_votes": 9,
        "days_ago": 2,
        "text": "Very comfortable and high quality yarn. Good communicative seller."
    },
    {
        "author": "Harsh Vardhan",
        "rating": 2,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 14,
        "days_ago": 11,
        "text": "Item had a loose thread near the border. Not catastrophic, but expected better quality control."
    },
    {
        "author": "Kylie Jenner Fan",
        "rating": 5,
        "is_verified": False,
        "channel": "Twitter/X",
        "helpful_votes": 3,
        "days_ago": 1,
        "text": "So aesthetic! Looks super cute in my room and the weave is very soft."
    },
    {
        "author": "Leo Tolstoy",
        "rating": 4,
        "is_verified": True,
        "channel": "Google Reviews",
        "helpful_votes": 12,
        "days_ago": 12,
        "text": "Substantial weight and graceful craftsmanship. A genuine reflection of dedication to artisan work."
    },
    {
        "author": "Pallavi G.",
        "rating": 5,
        "is_verified": True,
        "channel": "Amazon",
        "helpful_votes": 15,
        "days_ago": 7,
        "text": "Love the natural textures and earth tones. Truly elevated my everyday wardrobe."
    }
]


def generate_seed_reviews(classifier_func=None) -> list[dict]:
    """
    Returns populated reviews seeded with timestamps relative to today,
    word counts, and model predicted sentiment attributes.
    """
    base_time = datetime.now()
    reviews = []

    for idx, item in enumerate(RAW_REVIEWS):
        dt = base_time - timedelta(days=item["days_ago"], hours=random.randint(1, 18), minutes=random.randint(5, 55))
        review_id = f"rev-{idx+1:03d}"
        word_count = len(item["text"].split())

        review_obj = {
            "id": review_id,
            "author": item["author"],
            "rating": item["rating"],
            "is_verified": item["is_verified"],
            "channel": item["channel"],
            "helpful_votes": item["helpful_votes"],
            "days_ago": item["days_ago"],
            "timestamp": dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "date": dt.strftime("%Y-%m-%d"),
            "text": item["text"],
            "word_count": word_count,
        }

        if classifier_func:
            pred = classifier_func(item["text"])
            review_obj["sentiment"] = pred["sentiment"]
            review_obj["probabilities"] = pred["probabilities"]
            review_obj["confidence"] = pred["confidence"]
            review_obj["score"] = pred["score"]
            review_obj["normalized_score"] = pred["normalized_score"]

        reviews.append(review_obj)

    # Sort reviews by timestamp descending
    reviews.sort(key=lambda r: r["timestamp"], reverse=True)
    return reviews
