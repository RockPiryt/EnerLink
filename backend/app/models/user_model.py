from app.db import db
from datetime import datetime

class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(30))
    active = db.Column(db.Boolean, default=True)

    users = db.relationship("User", back_populates="role")
    role_changes = db.relationship("RoleChangeHistory", back_populates="role")

    def __repr__(self):
        return f"<Role {self.role_name}>"


class Password(db.Model):
    __tablename__ = "password"

    id = db.Column(db.Integer, primary_key=True)
    pass_hash = db.Column("pass", db.String(20))
    creation_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="password", uselist=False)

    def __repr__(self):
        return f"<Password id={self.id}>"

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

    role = db.relationship("Role", back_populates="users")
    password = db.relationship("Password", back_populates="user")

    changes_made = db.relationship(
        "UserChangeHistory",
        foreign_keys="[UserChangeHistory.id_user_who_changed]",
        back_populates="changed_by",
    )
    changes_received = db.relationship(
        "UserChangeHistory",
        foreign_keys="[UserChangeHistory.id_user_changed]",
        back_populates="changed_user",
    )
    logs = db.relationship("UserLogHistory", back_populates="user")
    role_changes_made = db.relationship(
        "RoleChangeHistory",
        foreign_keys="[RoleChangeHistory.id_user_who_changed]",
        back_populates="changed_by",
    )

    def __repr__(self):
        return f"<User {self.first_name} {self.last_name}>"
