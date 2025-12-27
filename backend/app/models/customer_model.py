from datetime import datetime
from app.db import db


class Customer(db.Model):
    __tablename__ = "customer"

    id = db.Column(db.Integer, primary_key=True)

    # owner / opiekun klienta (zgodnie z Twoim User.id = String(12))
    id_user = db.Column(db.String(12), db.ForeignKey("user.id"), nullable=True)

    # tag (opcjonalnie)
    id_tag = db.Column(db.Integer, db.ForeignKey("tag.id"), nullable=True)

    # Basic identity / contact
    name = db.Column(db.String(30))
    last_name = db.Column(db.String(50))
    company = db.Column(db.String(300))
    email = db.Column(db.String(100))
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

    # description + soft delete
    description = db.Column(db.String(500), nullable=True)
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

    # Status / timestamps
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # updated_at
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Relations
    pkwiu = db.relationship("Pkwiu", backref="customers")

    # relation to user + tag
    user = db.relationship("User", foreign_keys=[id_user])
    tag = db.relationship("Tag", foreign_keys=[id_tag])

    # 1:1 link to CustomerAddress
    customer_address = db.relationship(
        "CustomerAddress",
        back_populates="customer",
        uselist=False,
        cascade="all, delete-orphan"
    )

    assignments = db.relationship(
        "Assignment",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    # PPE relation (1 customer -> many PPE)
    ppes = db.relationship(
        "PPE",
        backref="customer_ref", 
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Customer {self.name} {self.last_name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "id_document": self.id_document,
            "pkwiu": self.pkwiu.to_dict() if self.pkwiu else None,
            "id_user": self.id_user,
            "id_tag": self.id_tag,
            "name": self.name,
            "last_name": self.last_name,
            "company": self.company,
            "description": self.description,
            "is_deleted": self.is_deleted,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "email": self.email,
            "phone": self.phone,
            "pesel": self.pesel,
            "nip": self.nip,
            "regon": self.regon,
            "representative": self.representative,
            "private_or_company": self.private_or_company,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "address": self.customer_address.to_dict() if self.customer_address else None,# single address
            "ppes": [p.to_dict() for p in self.ppes] if self.ppes else [] # PPE list
        }
