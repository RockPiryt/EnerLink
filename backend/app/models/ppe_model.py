from app.db import db
from datetime import datetime

class PPE(db.Model):
    __tablename__ = "ppe"

    id = db.Column(db.Integer, primary_key=True)

    id_customer = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    id_address = db.Column(db.Integer, db.ForeignKey("addresses.id"), nullable=False)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)

    active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    customer = db.relationship("Customer")
    address = db.relationship("Address")

    def to_dict(self):
        return {
            "id": self.id,
            "id_customer": self.id_customer,
            "id_address": self.id_address,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
