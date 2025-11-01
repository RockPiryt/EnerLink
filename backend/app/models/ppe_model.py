from app.db import db
from datetime import datetime

class PPE(db.Model):
    __tablename__ = "ppe"

    id = db.Column(db.Integer, primary_key=True)
    id_customer = db.Column(db.Integer, db.ForeignKey("customer.id"))
    id_address = db.Column(db.Integer, db.ForeignKey("address.id"))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    active = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    customer = db.relationship("Customer")
    address = db.relationship("Address")
