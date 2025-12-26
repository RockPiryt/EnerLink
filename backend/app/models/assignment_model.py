from datetime import datetime
from app.db import db

class Assignment(db.Model):
    __tablename__ = "assignments"  # customer -> sales rep link

    id = db.Column(db.Integer, primary_key=True)

    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)  # linked customer
    sales_rep_id = db.Column(db.String(12), db.ForeignKey("user.id"), nullable=False)  # linked sales rep

    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # assignment timestamp
    active = db.Column(db.Boolean, default=True, nullable=False)  # soft-disable assignment

    customer = db.relationship("Customer", back_populates="assignments")  # assignment->customer
    sales_rep = db.relationship("User", back_populates="assignments")  # assignment->user

    __table_args__ = (
        db.UniqueConstraint("customer_id", "sales_rep_id", name="uq_assignment_customer_salesrep"),
    )
