from app.db import db
from datetime import datetime

class Country(db.Model):
    __tablename__ = "countries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    shortcut = db.Column(db.String(5), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "shortcut": self.shortcut,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class City(db.Model):
    __tablename__ = "cities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class District(db.Model):
    __tablename__ = "districts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    street_name = db.Column(db.String(100))
    building_nr = db.Column(db.Integer)
    apartment_nr = db.Column(db.Integer)
    post_code = db.Column(db.String(20))

    id_city = db.Column(db.Integer, db.ForeignKey("cities.id"))
    id_district = db.Column(db.Integer, db.ForeignKey("districts.id"))
    id_country = db.Column(db.Integer, db.ForeignKey("countries.id"))

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    city = db.relationship("City")
    district = db.relationship("District")
    country = db.relationship("Country")

    def to_dict(self):
        return {
            "id": self.id,
            "street_name": self.street_name,
            "building_nr": self.building_nr,
            "apartment_nr": self.apartment_nr,
            "post_code": self.post_code,
            "id_city": self.id_city,
            "id_district": self.id_district,
            "id_country": self.id_country,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
