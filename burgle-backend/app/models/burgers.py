from app.extensions import db
import os

class Burger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    top_bun = db.Column(db.String(200), nullable=False)
    meat = db.Column(db.String(200), nullable=False)
    cheese = db.Column(db.String(200), nullable=False)
    sauce = db.Column(db.String(200), nullable=False)
    pickles = db.Column(db.String(200),nullable=True)
    lettuce = db.Column(db.String(200),nullable=True)
    tomato = db.Column(db.String(200),nullable=True)
    bottom_bun = db.Column(db.String(200), nullable=False)
    spoon_count = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Date, nullable=False)
    is_template = db.Column(db.Boolean, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  

    user = db.relationship('User', backref=db.backref('burgers', lazy=True))

    def to_dict(self):
        return {
    "id": self.id,
    "top_bun": self.top_bun,
    "meat": self.meat,
    "cheese": self.cheese,
    "sauce": self.sauce,
    "pickles": self.pickles or None,
    "lettuce": self.lettuce or None,
    "tomato": self.tomato or None,
    "bottom_bun": self.bottom_bun,
    "spoon_count": self.spoon_count,
    "created_at": self.created_at.strftime("%Y-%m-%d"),
    "is_template": self.is_template or None,
    "user_id": self.user_id
  }

    def __repr__(self):
      return f"<Burger {self.id}: {self.top_bun} + {self.meat} + {self.cheese} + {self.bottom_bun}>"