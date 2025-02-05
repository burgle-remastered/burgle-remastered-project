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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  

    user = db.relationship('User', backref=db.backref('burgers', lazy=True))

    def __repr__(self):
      return f"<Burger {self.id}: {self.top_bun} + {self.meat} + {self.cheese} + {self.bottom_bun}>"