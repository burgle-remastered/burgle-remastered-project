from flask import Blueprint, request, make_response, jsonify, send_from_directory
from flask_login import login_user, logout_user, login_required
from app.models.users import User, db
from flask_login import LoginManager, current_user
from flask import session
from flask_cors import cross_origin
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)
login_manager = LoginManager()
login_manager.login_view = "auth.login"

@auth_bp.route('/register', methods=['POST'])
@cross_origin(methods=['POST'], supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='http://127.0.0.1:5000')
def register():
    data = request.get_json()
    #print("🤸 Received data:", data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    #print(f"🤸 Username: {username}, Email: {email}, Password: {password}")

    if not username or not email or not password:
        return {"error": "Username, email and password are required"}, 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "Email already registered"}, 400

    new_user = User(username=username,email=email)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        #print("✅ User successfully added to database!") 
        return {"message": "Registration successful"}, 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        #print(f"❌ Database Commit Error: {e}")  
        return {"error": "Database error"}, 500


@auth_bp.route('/login', methods=[ 'POST'])
@cross_origin(methods=['POST'], supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='http://127.0.0.1:5000')
def login():
    # {"username":"Madison", "email":"madisontolentino@gmail.com","password":"helloworld"}
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        #print(type(password))

        user = User.query.filter_by(username=username).first()
        #print(data,user)
        if user and user.check_password(password):
            login_user(user)
            session['user_id'] = user.id
            session.permanent = True 
            session.permanent_session_lifetime = timedelta(days=7)
            res =  jsonify({"message": "Login successful", "user_id": user.id}, 200)
            res.set_cookie('session_id', str(user.id), httponly=True, samesite='Lax', path='/', secure=False) 
            return res
        else:
            return jsonify({"error": "Invalid credentials"}, 401)



@auth_bp.route('/logout')
@cross_origin( supports_credentials=True, headers=['Content-Type', 'Authorization'], origin='http://127.0.0.1:5000')
@login_required
def logout():
    session.pop('user_id', None)
    logout_user()
    res = make_response({"message": "Logout successful"}, 200)
    res.set_cookie('session_id', '', expires=0)
    return res

@auth_bp.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return {"error": "User not found"}, 404

    return {
        "username": user.username,
        "email": user.email
    }, 200

@auth_bp.route('/user/del/<int:user_id>', methods=['DELETE'])
@cross_origin(methods=['DELETE'], supports_credentials=True, origin='http://127.0.0.1:5000')
def delete_user(username):
    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401  # Unauthorized if the user is not logged in

    user = current_user
    if request.method == 'DELETE':
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": f"User '{username}' successfully deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to delete user {e}"}, 500

    return {
        "username": user.username,
        "email": user.email
    }, 200

@auth_bp.route('/user/<int:user_id>', methods=['PATCH','OPTIONS'])
@cross_origin(methods=['PATCH','OPTIONS'], supports_credentials=True, origin='http://127.0.0.1:5000')
def update_user(user_id):
    if request.method == 'OPTIONS':
        response = make_response('', 200)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'

        print("OPTIONS Response Headers:", dict(response.headers))  # Print headers to confirm
        return response

    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    user = User.query.get(user_id)

    if not user:
        return {"error": "Invalid session"}, 401

    new_username = data.get('username')
    new_email = data.get('email')
    new_password = data.get('password')

    if not new_username and not new_email:
        return {"error": "No fields to update"}, 400

    if new_username:
        user.username = new_username
    if new_email:
        user.email = new_email
    if new_password:
        user.set_password(new_password)

    try:
        db.session.commit()
        return {"message": f"User '{user.username}' updated successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to update user {e}"}, 500


