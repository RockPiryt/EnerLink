from app.db import db

class EnergySupplier(db.Model):
    __tablename__ = "energy_supplier"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)

    addresses = db.relationship("SupplierAddress", back_populates="supplier")
    offers = db.relationship("SupplierOffer", back_populates="supplier")


class EnergyTariff(db.Model):
    __tablename__ = "energy_tariff"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)


class PowerUnit(db.Model):
    __tablename__ = "power_unit"

    id = db.Column(db.Integer, primary_key=True)
    shorcut = db.Column(db.String(5), nullable=False)
    nazwa = db.Column(db.String(10), nullable=False)


class CurrencyUnit(db.Model):
    __tablename__ = "currency_unit"

    id = db.Column(db.Integer, primary_key=True)
    shorcut = db.Column(db.String(5), nullable=False)
    nazwa = db.Column(db.String(10), nullable=False)


class SupplierOffer(db.Model):
    __tablename__ = "supplier_offer"

    id = db.Column(db.Integer, primary_key=True)
    id_supplier = db.Column(db.Integer, db.ForeignKey("energy_supplier.id"))
    id_tariff = db.Column(db.Integer, db.ForeignKey("energy_tariff.id"))
    id_power_unit = db.Column(db.Integer, db.ForeignKey("power_unit.id"))
    id_currency_unit = db.Column(db.Integer, db.ForeignKey("currency_unit.id"))
    price = db.Column(db.Numeric(10, 2))
    active = db.Column(db.Boolean)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    supplier = db.relationship("EnergySupplier", back_populates="offers")
    tariff = db.relationship("EnergyTariff")
    power_unit = db.relationship("PowerUnit")
    currency_unit = db.relationship("CurrencyUnit")
