from app.db import db

class Country(db.Model):
    __tablename__ = "country"

    id = db.Column(db.Integer, primary_key=True)
    shorcut = db.Column(db.String(5), nullable=False)
    name = db.Column(db.String(50), nullable=False)


class City(db.Model):
    __tablename__ = "city"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


class District(db.Model):
    __tablename__ = "district"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


class Address(db.Model):
    __tablename__ = "address"

    id = db.Column(db.Integer, primary_key=True)
    street = db.Column(db.String(100))
    building_nr = db.Column(db.String(30))
    local_nr = db.Column(db.String(20))
    post_code = db.Column(db.String(10))
    id_city = db.Column(db.Integer, db.ForeignKey("city.id"))
    id_district = db.Column(db.Integer, db.ForeignKey("district.id"))
    id_country = db.Column(db.Integer, db.ForeignKey("country.id"))

    city = db.relationship("City")
    district = db.relationship("District")
    country = db.relationship("Country")
