from app.db import db
from datetime import datetime


class EnergySupplier(db.Model):
    __tablename__ = "energy_supplier"
    __table_args__ = {"sqlite_autoincrement": True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    offers = db.relationship(
        "SupplierOffer",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )

    supplier_address = db.relationship(
        "SupplierAddress",
        back_populates="supplier",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class EnergyTariff(db.Model):
    __tablename__ = "energy_tariff"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class PowerUnit(db.Model):
    __tablename__ = "power_unit"

    id = db.Column(db.Integer, primary_key=True)
    shortcut = db.Column(db.String(10), nullable=False, unique=True)
    name = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {"id": self.id, "shortcut": self.shortcut, "name": self.name}


class CurrencyUnit(db.Model):
    __tablename__ = "currency_unit"

    id = db.Column(db.Integer, primary_key=True)
    shortcut = db.Column(db.String(10), nullable=False, unique=True)
    name = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {"id": self.id, "shortcut": self.shortcut, "name": self.name}


class SupplierOffer(db.Model):
    __tablename__ = "supplier_offer"

    id = db.Column(db.Integer, primary_key=True)

    id_supplier = db.Column(db.Integer, db.ForeignKey("energy_supplier.id"), nullable=False)
    id_tariff = db.Column(db.Integer, db.ForeignKey("energy_tariff.id"), nullable=False)
    id_power_unit = db.Column(db.Integer, db.ForeignKey("power_unit.id"), nullable=True)
    id_currency_unit = db.Column(db.Integer, db.ForeignKey("currency_unit.id"), nullable=True)

    price = db.Column(db.Numeric(10, 2), nullable=True)
    active = db.Column(db.Boolean, default=True, nullable=False)

    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    supplier = db.relationship("EnergySupplier", back_populates="offers")
    tariff = db.relationship("EnergyTariff")
    power_unit = db.relationship("PowerUnit")
    currency_unit = db.relationship("CurrencyUnit")

    def to_dict(self):
        return {
            "id": self.id,
            "id_supplier": self.id_supplier,
            "supplier": self.supplier.to_dict() if self.supplier else None,
            "id_tariff": self.id_tariff,
            "tariff": self.tariff.to_dict() if self.tariff else None,
            "price": str(self.price) if self.price is not None else None,
            "active": self.active,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
