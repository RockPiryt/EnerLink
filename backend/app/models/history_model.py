from app.db import db
from datetime import datetime

class Action(db.Model):
    __tablename__ = "action"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))


class UserChangeHistory(db.Model):
    __tablename__ = "user_change_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user_who_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_user_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    change_time = db.Column(db.DateTime, default=datetime.utcnow)


class UserLogHistory(db.Model):
    __tablename__ = "user_log_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    log_time = db.Column(db.DateTime, default=datetime.utcnow)


class RoleChangeHistory(db.Model):
    __tablename__ = "role_change_history"

    id = db.Column(db.Integer, primary_key=True)
    id_user_who_changed = db.Column(db.String(12), db.ForeignKey("user.id"))
    id_role = db.Column(db.Integer, db.ForeignKey("role.id"))
    id_action = db.Column(db.Integer, db.ForeignKey("action.id"))
    change_time = db.Column(db.DateTime, default=datetime.utcnow)
