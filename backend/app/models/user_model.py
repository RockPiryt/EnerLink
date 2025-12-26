from app.db import db
from datetime import datetime

class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(30), nullable=False, unique=True)
    active = db.Column(db.Boolean, default=True, nullable=False)

    users = db.relationship("User", back_populates="role")

    def to_dict(self):
        return {
            "id": self.id,
            "role_name": self.role_name,
            "active": self.active
        }


class Password(db.Model):
    __tablename__ = "password"

    id = db.Column(db.Integer, primary_key=True)
    pass_hash = db.Column("pass", db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="password", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.String(12), primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    e_mail = db.Column(db.String(100), unique=True, nullable=False)

    id_role = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=False)
    id_pass = db.Column(db.Integer, db.ForeignKey("password.id"), unique=True, nullable=True)

    active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    role = db.relationship("Role", back_populates="users")
    password = db.relationship("Password", back_populates="user")

    # Contracts relations (defined in contract_model.py)
    managed_contracts = db.relationship(
        "Contract",
        foreign_keys="[Contract.id_user]",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    assignments = db.relationship("Assignment", back_populates="sales_rep", cascade="all, delete-orphan")  # assigned customers

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "e_mail": self.e_mail,
            "id_role": self.id_role,
            "role_name": self.role.role_name if self.role else None,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
