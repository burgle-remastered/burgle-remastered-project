from flask import Blueprint, request
from app.models.burgers import Burger, db
from app.models.users import User

burger_bp = Blueprint('burger', __name__)

@burger_bp.route('/burger/<username>', methods = ['GET'])
def get_burger(username):
  user = User.query.filter_by(username=username).first()
  burger = Burger.query.filter_by(user_id=user.id).first()