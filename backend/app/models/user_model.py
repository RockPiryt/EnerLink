from datetime import datetime
from app.db import db


class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(30), nullable=False, unique=True)
    active = db.Column(db.Boolean, default=True, nullable=False)

    users = db.relationship("User", back_populates="role")
    role_changes = db.relationship("RoleChangeHistory", back_populates="role")

    def to_dict(self):
        return {"id": self.id, "role_name": self.role_name, "active": self.active}


class Password(db.Model):
    __tablename__ = "password"

    id = db.Column(db.Integer, primary_key=True)
    pass_hash = db.Column("pass", db.String(255), nullable=False)  # will store a hash
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="password", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.String(12), primary_key=True)  # ADM001 etc.
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)  # email

    id_role = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=False)  # role fk
    id_pass = db.Column(db.Integer, db.ForeignKey("password.id"), unique=True, nullable=True)  # password fk

    active = db.Column(db.Boolean, default=True, nullable=False)  # user status
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # creation time

    role = db.relationship("Role", back_populates="users")  # role relationship
    password = db.relationship("Password", back_populates="user")  # password relationship

    managed_contracts = db.relationship(
        "Contract",
        foreign_keys="[Contract.id_user]",
        back_populates="user",
        cascade="all, delete-orphan"
    )  # contracts managed by user

    assignments = db.relationship(
        "Assignment",
        back_populates="sales_rep",
        cascade="all, delete-orphan"
    )  # customer assignments for sales rep

    changes_made = db.relationship(
        "UserChangeHistory",
        foreign_keys="UserChangeHistory.id_user_who_changed",
        back_populates="changed_by"
    )  # user changes performed by this user

    changes_received = db.relationship(
        "UserChangeHistory",
        foreign_keys="UserChangeHistory.id_user_changed",
        back_populates="changed_user"
    )  # changes applied to this user

    logs = db.relationship(
        "UserLogHistory",
        back_populates="user"
    )  # log events for this user

    role_changes_made = db.relationship(
        "RoleChangeHistory",
        foreign_keys="RoleChangeHistory.id_user_who_changed",
        back_populates="changed_by"
    )  # role changes performed by this user

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "id_role": self.id_role,
            "role_name": self.role.role_name if self.role else None,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
