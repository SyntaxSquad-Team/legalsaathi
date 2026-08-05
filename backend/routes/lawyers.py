from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, Lawyer, LawyerBooking, Document
from models import LawyerOut, LawyerMatchRequest, BookingCreate, BookingOut
from services.lawyer_seed import seed_lawyers_if_empty
from services.similar_case_finder import detect_case_type

router = APIRouter()


@router.get("/lawyers", response_model=list[LawyerOut])
def list_lawyers(db: Session = Depends(get_db)):
    """List all lawyers in the directory (multiple lawyers, for browsing/booking)."""
    seed_lawyers_if_empty(db, Lawyer)
    lawyers = db.query(Lawyer).order_by(Lawyer.rating.desc()).all()
    return [LawyerOut(**l.__dict__) for l in lawyers]


@router.post("/lawyers/match", response_model=list[LawyerOut])
def match_lawyers(payload: LawyerMatchRequest, db: Session = Depends(get_db)):
    """Match lawyers to a case. If doc_id is given, the case type is detected
    from the document automatically; otherwise pass case_type / city directly."""
    seed_lawyers_if_empty(db, Lawyer)

    case_type = payload.case_type
    if payload.doc_id and not case_type:
        doc = db.query(Document).filter(Document.doc_id == payload.doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found.")
        case_type = detect_case_type(doc.extracted_text)

    lawyers = db.query(Lawyer).all()
    scored = []
    for l in lawyers:
        score = 40
        if case_type and l.specialization.lower() == case_type.lower():
            score += 40
        if payload.city and l.city.lower() == payload.city.lower():
            score += 20
        score += min(l.experience_years, 20)
        score += l.rating * 2
        out = LawyerOut(**l.__dict__)
        out.match_score = min(score, 100)
        scored.append(out)

    scored.sort(key=lambda x: x.match_score, reverse=True)
    return scored[:6]


@router.post("/lawyers/book", response_model=BookingOut)
def book_lawyer(payload: BookingCreate, db: Session = Depends(get_db)):
    """Send a booking/consultation request to a lawyer."""
    lawyer = db.query(Lawyer).filter(Lawyer.id == payload.lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found.")

    booking = LawyerBooking(
        lawyer_id=payload.lawyer_id,
        doc_id=payload.doc_id,
        client_name=payload.client_name,
        client_contact=payload.client_contact,
        message=payload.message or "",
        status="requested",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return BookingOut(
        id=booking.id,
        lawyer_id=lawyer.id,
        lawyer_name=lawyer.name,
        client_name=booking.client_name,
        status=booking.status,
        created_at=booking.created_at.strftime("%Y-%m-%d %H:%M"),
    )


@router.get("/lawyers/bookings/{client_contact}", response_model=list[BookingOut])
def get_my_bookings(client_contact: str, db: Session = Depends(get_db)):
    """List booking requests made by a client (looked up by contact/email)."""
    bookings = db.query(LawyerBooking).filter(LawyerBooking.client_contact == client_contact).all()
    out = []
    for b in bookings:
        lawyer = db.query(Lawyer).filter(Lawyer.id == b.lawyer_id).first()
        out.append(BookingOut(
            id=b.id,
            lawyer_id=b.lawyer_id,
            lawyer_name=lawyer.name if lawyer else "Unknown",
            client_name=b.client_name,
            status=b.status,
            created_at=b.created_at.strftime("%Y-%m-%d %H:%M"),
        ))
    return out
