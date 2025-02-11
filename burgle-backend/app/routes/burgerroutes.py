from flask import Blueprint, request, jsonify, session
from app.models.burgers import Burger, db
from app.models.users import User
from datetime import date
from flask_login import current_user
from flask_cors import cross_origin

burger_bp = Blueprint('burger', __name__)

@burger_bp.route('/all', methods = ['POST','GET'])
@cross_origin(methods=['POST','GET'], supports_credentials=True, origin='http://127.0.0.1:5000')
def get_all_burgers():
  data = request.json
  user_data = data.get('body').get('user')
  
  if not user_data:
        return jsonify({'error': 'Unauthorized'}), 401

  
  user = User.query.get(user_data) 

  if not user:
    return {"error": "Invalid session"}, 401
  
  
  burgers = Burger.query.filter_by(user_id=user.id).all() 
  burgers_dict = [burger.to_dict() for burger in burgers]
  return jsonify({'burgers': burgers_dict})


@burger_bp.route('/<string:date>', methods = ['GET'])
@cross_origin(methods=['GET'], supports_credentials=True, origin='http://127.0.0.1:5000')
def get_burger_by_date(date):
  if not current_user.is_authenticated:
    return {"error": "User not authenticated"}, 401  # Unauthorized if the user is not logged in

  user = current_user
  burger = Burger.query.filter_by(user_id=user.id, created_at=date).first() 
  return {
    "id": burger.id,
    "top_bun": burger.top_bun,
    "meat": burger.meat,
    "cheese": burger.cheese,
    "sauce": burger.sauce,
    "pickles": burger.pickles or None,
    "lettuce": burger.lettuce or None,
    "tomato": burger.tomato or None,
    "bottom_bun": burger.bottom_bun,
    "spoon_count": burger.spoon_count,
    "created_at": burger.created_at.strftime("%Y-%m-%d"),
    "is_template": burger.is_template or None,
    "user_id": burger.user_id
  }

@burger_bp.route('/', methods = ['POST'])
def create_burger():
  # {"top_bun": "wakeup", "meat": "go to marcy", "cheese": "eat lunch", "sauce":"journal", "bottom_bun": "sleep", "spoon_count": 20}
  data = request.get_json()
  # print(data)
  if not current_user.is_authenticated:
    return {"error": "User not authenticated"}, 401  

  user = current_user  

  if not user:
    return {"error": "User not found"}, 404
  
  existing_burger = Burger.query.filter_by(created_at=date.today()).first() #premake tmrws burger (stretch)

  if existing_burger:
    return {"error": "Burger already created today"}, 404

  new_burger = Burger(
    top_bun=data['top_bun'],
    meat=data['meat'],
    cheese=data['cheese'],
    sauce=data['sauce'],
    bottom_bun=data['bottom_bun'],
    spoon_count=data['spoon_count'],
    created_at=date.today(),
    user_id=user.id
  )

  try:
    db.session.add(new_burger)
    db.session.commit()
    print("✅ Burger successfully added to database!") 
    return {"message": "Burger created successfully"}, 201
  except Exception as e:
    db.session.rollback()  # Rollback in case of error
    print(f"❌ Database Commit Error: {e}")  
    return {"error": "Database error"}, 500

@burger_bp.route('/<int:burger_id>', methods = ['PATCH'])
@cross_origin(methods=['PATCH'], supports_credentials=True, origin='http://127.0.0.1:5000')
def update_burger(burger_id):
  data = request.get_json()
  if not current_user.is_authenticated:
    return {"error": "User not authenticated"}, 401  

  user = current_user 

  burger = Burger.query.filter_by(id=burger_id, user_id=user.id).first() 

  pickles = data.get('pickles')
  lettuce = data.get('lettuce')
  tomato = data.get('tomato')
  is_template = data.get('is_template')

  new_top_bun = data.get('top_bun')
  new_meat = data.get('meat')
  new_cheese = data.get('cheese')
  new_sauce = data.get('sauce')
  new_bottom_bun = data.get('bottom_bun')
  new_spoon_count = data.get('spoon_count')

  if new_top_bun:
    burger.top_bun = new_top_bun
  if new_meat:
    burger.meat = new_meat
  if new_cheese:
    burger.cheese = new_cheese
  if new_sauce:
    burger.sauce = new_sauce
  if new_bottom_bun:
    burger.bottom_bun = new_bottom_bun
  if new_spoon_count:
    burger.spoon_count = new_spoon_count
  if pickles:
    burger.pickles = pickles
  if lettuce:
    burger.lettuce = lettuce
  if tomato:
    burger.tomato = tomato
  if is_template:
    burger.is_template = is_template

  try:
    db.session.commit()
    return {"message": f"{user.username}'s burger updated successfully"}, 200
  except Exception as e:
    db.session.rollback()
    return {"error": f"Failed to update burger {e}"}, 500
  
@burger_bp.route('/<int:burger_id>', methods = ['GET'])
@cross_origin(methods=['GET'], supports_credentials=True, origin='http://127.0.0.1:5000')
def get_burger(burger_id):
  if not current_user.is_authenticated:
    return {"error": "User not authenticated"}, 401  # Unauthorized if the user is not logged in

  user = current_user
  burger = Burger.query.filter_by(id=burger_id,user_id=user.id).first() 
  return {
    "id": burger.id,
    "top_bun": burger.top_bun,
    "meat": burger.meat,
    "cheese": burger.cheese,
    "sauce": burger.sauce,
    "pickles": burger.pickles or None,
    "lettuce": burger.lettuce or None,
    "tomato": burger.tomato or None,
    "bottom_bun": burger.bottom_bun,
    "spoon_count": burger.spoon_count,
    "created_at": burger.created_at.strftime("%Y-%m-%d"),
    "is_template": burger.is_template or None,
    "user_id": burger.user_id
  }

@burger_bp.route('/<int:burger_id>', methods=['DELETE'])
@cross_origin(methods=['DELETE'], supports_credentials=True, origin='http://127.0.0.1:5000')
def delete_burger(burger_id):
    if not current_user.is_authenticated:
      return {"error": "User not authenticated"}, 401  

    user = current_user 
    burger = Burger.query.filter_by(id=burger_id,user_id=user.id).first() 

    if not burger:
      return {"error": "No burger found for today"}, 404
    
    try:
      db.session.delete(burger)
      db.session.commit()
      return {"message": f"{user.username}'s burger successfully deleted"}, 200
    except Exception as e:
      db.session.rollback()
      return {"error": f"Failed to delete burger {e}"}, 500