from app.db import db
from datetime import datetime

class Action(db.Model):
    __tablename__ = "action"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))

    user_changes = db.relationship("UserChangeHistory", back_populates="action")
    user_logs = db.relationship("UserLogHistory", back_populates="action")
    role_changes = db.relationship("RoleChangeHistory", back_populates="action")

    def __repr__(self):
        return f"<Action {self.name}>"

class UserChangeHistory(db.Model):
    __tablename__ = "user_change_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user_who_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_user_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    change_time = db.Column(db.DateTime, default=datetime.utcnow)

    changed_by = db.relationship(
        "User", foreign_keys=[id_user_who_changed], back_populates="changes_made"
    )
    changed_user = db.relationship(
        "User", foreign_keys=[id_user_changed], back_populates="changes_received"
    )
    action = db.relationship("Action", back_populates="user_changes")

    def __repr__(self):
        return f"<UserChangeHistory action={self.id_action} at={self.change_time}>"

class UserLogHistory(db.Model):
    __tablename__ = "user_log_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    log_time = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="logs")
    action = db.relationship("Action", back_populates="user_logs")

    def __repr__(self):
        return f"<UserLogHistory user={self.id_user} action={self.id_action}>"

class RoleChangeHistory(db.Model):
    __tablename__ = "role_change_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user_who_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_role = db.Column(db.Integer, db.ForeignKey("role.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    change_time = db.Column(db.DateTime, default=datetime.utcnow)

    changed_by = db.relationship(
        "User", foreign_keys=[id_user_who_changed], back_populates="role_changes_made"
    )
    role = db.relationship("Role", back_populates="role_changes")
    action = db.relationship("Action", back_populates="role_changes")

    def __repr__(self):
        return f"<RoleChangeHistory role={self.id_role} at={self.change_time}>"
