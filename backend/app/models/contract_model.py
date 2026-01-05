from app.db import db
from datetime import datetime

class Contract(db.Model):
    __tablename__ = "contract"

    id = db.Column(db.Integer, primary_key=True)

    # opiekun klienta
    id_user = db.Column(db.String(12), db.ForeignKey("user.id"), nullable=True)
    id_customer = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    id_tag = db.Column(db.Integer, db.ForeignKey("tag.id"), nullable=True)
    contract_number = db.Column(db.String(150), nullable=False, unique=True)

    signed_at = db.Column(db.Date, nullable=True)
    contract_from = db.Column(db.Date, nullable=True)
    contract_to = db.Column(db.Date, nullable=True)

    # oferta dostawcy
    id_supplier_offer = db.Column(db.Integer, db.ForeignKey("supplier_offer.id"), nullable=True)

    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relations
    user = db.relationship("User", back_populates="managed_contracts")
    customer = db.relationship("Customer")
    tag = db.relationship("Tag")
    supplier_offer = db.relationship("SupplierOffer")

    timelines = db.relationship("ContractTimeline", back_populates="contract", cascade="all, delete-orphan")

    def to_dict(self):
        # Get latest status from timelines (by created_at desc)
        latest_status = None
        if self.timelines:
            latest = max(self.timelines, key=lambda t: t.created_at)
            latest_status = latest.status
        return {
            "id": self.id,
            "id_user": self.id_user,
            "id_customer": self.id_customer,
            "contract_number": self.contract_number,
            "signed_at": self.signed_at.isoformat() if self.signed_at else None,
            "contract_from": self.contract_from.isoformat() if self.contract_from else None,
            "contract_to": self.contract_to.isoformat() if self.contract_to else None,
            "id_tag": self.id_tag,
            "id_supplier_offer": self.id_supplier_offer,
            "is_deleted": self.is_deleted,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "status": latest_status,
        }


class ContractTimeline(db.Model):
    __tablename__ = "contract_timeline"

    id = db.Column(db.Integer, primary_key=True)
    id_contract = db.Column(db.Integer, db.ForeignKey("contract.id"), nullable=False)

    status = db.Column(db.String(50), nullable=False)  # np. "NEW", "SIGNED", "CANCELLED"
    description = db.Column(db.String(500), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    contract = db.relationship("Contract", back_populates="timelines")

    def to_dict(self):
        return {
            "id": self.id,
            "id_contract": self.id_contract,
            "status": self.status,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
