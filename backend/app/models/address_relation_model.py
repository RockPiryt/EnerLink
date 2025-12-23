from app.db import db

class CustomerAddress(db.Model):
    __tablename__ = "customer_address"

    id = db.Column(db.Integer, primary_key=True)
    id_address = db.Column(db.Integer, db.ForeignKey("addresses.id"), nullable=False)
    id_customer = db.Column(db.Integer, db.ForeignKey("customer.id"), unique=True, nullable=False)

    address = db.relationship("Address")
    customer = db.relationship("Customer", back_populates="customer_address")

    def to_dict(self):
        return {
            "id": self.id,
            "id_customer": self.id_customer,
            "id_address": self.id_address,
            "address": self.address.to_dict() if self.address else None
        }


class SupplierAddress(db.Model):
    __tablename__ = "supplier_address"

    id = db.Column(db.Integer, primary_key=True)
    id_address = db.Column(db.Integer, db.ForeignKey("addresses.id"), nullable=False)
    id_supplier = db.Column(db.Integer, db.ForeignKey("energy_supplier.id"), unique=True, nullable=False)

    address = db.relationship("Address")
    supplier = db.relationship("EnergySupplier", back_populates="supplier_address")

    def to_dict(self):
        return {
            "id": self.id,
            "id_supplier": self.id_supplier,
            "id_address": self.id_address,
            "address": self.address.to_dict() if self.address else None
        }
