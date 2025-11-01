from app.db import db
from datetime import datetime

class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(30))
    active = db.Column(db.Boolean, default=True)


class Password(db.Model):
    __tablename__ = "password"

    id = db.Column(db.Integer, primary_key=True)
    pass_hash = db.Column("pass", db.String(20))
    creation_at = db.Column(db.DateTime, default=datetime.utcnow)


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.String(12), primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    e_mail = db.Column(db.String(100))
    id_role = db.Column(db.Integer, db.ForeignKey("role.id"))
    id_pass = db.Column(db.Integer, db.ForeignKey("password.id"), unique=True)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    role = db.relationship("Role")
    password = db.relationship("Password", uselist=False)
