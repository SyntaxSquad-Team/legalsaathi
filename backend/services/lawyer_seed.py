"""Seed data for the lawyer directory. In production this would be a real
onboarding flow / admin panel; for the hackathon demo we seed a realistic
multi-lawyer directory on first startup so lawyer matching + booking work end-to-end."""

SEED_LAWYERS = [
    dict(name="Adv. Priya Nair", specialization="family", city="Bengaluru",
         experience_years=12, rating=5, fee_range="₹3,000 - ₹6,000/hearing",
         languages="English, Kannada, Malayalam",
         bio="Family law specialist handling divorce, custody, and maintenance cases.",
         contact="priya.nair@example-law.in"),
    dict(name="Adv. Rohan Mehta", specialization="criminal", city="Mumbai",
         experience_years=18, rating=5, fee_range="₹8,000 - ₹15,000/hearing",
         languages="English, Hindi, Marathi",
         bio="Criminal defence lawyer with two decades in Sessions and High Court matters.",
         contact="rohan.mehta@example-law.in"),
    dict(name="Adv. Kavita Iyer", specialization="civil", city="Chennai",
         experience_years=9, rating=4, fee_range="₹2,500 - ₹5,000/hearing",
         languages="English, Tamil",
         bio="Handles contract disputes, recovery suits, and property matters.",
         contact="kavita.iyer@example-law.in"),
    dict(name="Adv. Arjun Singh", specialization="property", city="Delhi",
         experience_years=15, rating=4, fee_range="₹5,000 - ₹10,000/hearing",
         languages="English, Hindi",
         bio="Property and tenancy disputes, eviction and possession matters.",
         contact="arjun.singh@example-law.in"),
    dict(name="Adv. Sneha Deshpande", specialization="family", city="Pune",
         experience_years=7, rating=4, fee_range="₹2,000 - ₹4,500/hearing",
         languages="English, Marathi, Hindi",
         bio="Focuses on mutual-consent divorce, mediation, and child custody.",
         contact="sneha.deshpande@example-law.in"),
    dict(name="Adv. Farhan Ahmed", specialization="criminal", city="Hyderabad",
         experience_years=11, rating=4, fee_range="₹4,000 - ₹9,000/hearing",
         languages="English, Hindi, Urdu, Telugu",
         bio="Bail applications, chargesheet review, and criminal trial defence.",
         contact="farhan.ahmed@example-law.in"),
    dict(name="Adv. Meera Krishnan", specialization="civil", city="Kochi",
         experience_years=14, rating=5, fee_range="₹3,500 - ₹7,000/hearing",
         languages="English, Malayalam, Tamil",
         bio="Civil litigation, breach of contract, and commercial disputes.",
         contact="meera.krishnan@example-law.in"),
    dict(name="Adv. Vikram Chauhan", specialization="property", city="Jaipur",
         experience_years=20, rating=5, fee_range="₹6,000 - ₹12,000/hearing",
         languages="English, Hindi",
         bio="Senior counsel for land disputes, encroachment, and municipal matters.",
         contact="vikram.chauhan@example-law.in"),
]


def seed_lawyers_if_empty(db, Lawyer):
    if db.query(Lawyer).count() == 0:
        for entry in SEED_LAWYERS:
            db.add(Lawyer(**entry))
        db.commit()
