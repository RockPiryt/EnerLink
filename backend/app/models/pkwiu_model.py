from app.db import db

class Pkwiu(db.Model):
    __tablename__ = "pkwiu"

    id = db.Column(db.Integer, primary_key=True)
    pkwiu_nr = db.Column(db.String(10), nullable=False)
    pkwiu_name = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f"<PKWiU {self.pkwiu_nr}>"

    def to_dict(self):
        return {
            "id": self.id,
            "pkwiu_nr": self.pkwiu_nr,
            "pkwiu_name": self.pkwiu_name
        }
