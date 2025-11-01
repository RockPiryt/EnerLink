from app.db import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = "customer"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    last_name = db.Column(db.String(50))
    company = db.Column(db.String(300))
    e_mail = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    pesel = db.Column(db.Integer)
    id_document = db.Column(db.String(20))  # Passport ID of foreigner
    nip = db.Column(db.String(20))
    id_pkwiu = db.Column(db.Integer, db.ForeignKey("pkwiu.id"))
    regon = db.Column(db.Integer)
    representative = db.Column(db.String(100))
    private_or_company = db.Column(db.Integer)  # 0 = private, 1 = company
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    pkwiu = db.relationship("Pkwiu", backref="customers")
    addresses = db.relationship("CustomerAddress", back_populates="customer")

    def __repr__(self):
        return f"<Customer {self.name} {self.last_name}>"
