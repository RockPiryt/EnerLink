from app.db import db

class CustomerAddress(db.Model):
    __tablename__ = "customer_address"

    id = db.Column(db.Integer, primary_key=True)
    id_address = db.Column(db.Integer, db.ForeignKey("address.id"))
    id_customer = db.Column(db.Integer, db.ForeignKey("customer.id"), unique=True)

    address = db.relationship("Address")
    customer = db.relationship("Customer", back_populates="addresses")


class SupplierAddress(db.Model):
    __tablename__ = "supplier_address"

    id = db.Column(db.Integer, primary_key=True)
    id_address = db.Column(db.Integer, db.ForeignKey("address.id"))
    id_supplier = db.Column(db.Integer, db.ForeignKey("energy_supplier.id"), unique=True)

    address = db.relationship("Address")
    supplier = db.relationship("EnergySupplier", back_populates="addresses")
