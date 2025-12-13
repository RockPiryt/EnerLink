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

    # Convert model to dict for JSON API
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "company": self.company,
            "email": self.e_mail,
            "phone": self.phone,
            "pesel": self.pesel,
            "id_document": self.id_document,
            "nip": self.nip,
            "pkwiu": self.pkwiu.to_dict() if self.pkwiu else None,
            "regon": self.regon,
            "representative": self.representative,
            "private_or_company": self.private_or_company,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,

            # serialize all addresses (customer.addresses is a relationship list)
            "addresses": [
                addr.to_dict() for addr in self.addresses
            ] if self.addresses else []
        }
