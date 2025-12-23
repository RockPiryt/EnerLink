from app.db import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = "customer"

    id = db.Column(db.Integer, primary_key=True)

    # Basic identity / contact
    name = db.Column(db.String(30))
    last_name = db.Column(db.String(50))
    company = db.Column(db.String(300))
    e_mail = db.Column(db.String(100))
    phone = db.Column(db.String(20))

    # Identifiers
    pesel = db.Column(db.Integer)
    id_document = db.Column(db.String(20))  # Passport ID of foreigner
    nip = db.Column(db.String(20))
    regon = db.Column(db.Integer)

    # Classification
    id_pkwiu = db.Column(db.Integer, db.ForeignKey("pkwiu.id"))
    representative = db.Column(db.String(100))
    private_or_company = db.Column(db.Integer)  # 0 = private, 1 = company

    # Status / timestamps
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    pkwiu = db.relationship("Pkwiu", backref="customers")

    # 1:1 link to CustomerAddress (enforced by unique=True in CustomerAddress.id_customer)
    customer_address = db.relationship(
        "CustomerAddress",
        back_populates="customer",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Customer {self.name} {self.last_name}>"

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
            "regon": self.regon,
            "pkwiu": self.pkwiu.to_dict() if self.pkwiu else None,
            "representative": self.representative,
            "private_or_company": self.private_or_company,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,

            # single address (not list)
            "address": self.customer_address.to_dict() if self.customer_address else None
        }
