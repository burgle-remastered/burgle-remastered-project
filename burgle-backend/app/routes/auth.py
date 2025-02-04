from flask import Blueprint, request
from flask_login import login_user, logout_user, login_required
from app.models.users import User, db
from flask_login import LoginManager

auth_bp = Blueprint('auth', __name__)
login_manager = LoginManager()
login_manager.login_view = "auth.login"

@auth_bp.route('/register', methods=['POST'])
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
        print(f"❌ Database Commit Error: {e}")  
        return {"error": "Database error"}, 500


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        print(type(password))

        user = User.query.filter_by(email=email).first()
        #print(user)
        if user and user.check_password(password):
            login_user(user)
            return {"message": "Login successful", "user_id": user.id}, 200
        else:
            return {"error": "Invalid credentials"}, 401



@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return {"message": "Logout successful"}, 200

@auth_bp.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return {"error": "User not found"}, 404

    return {
        "username": user.username,
        "email": user.email
    }, 200

@auth_bp.route('/user/<username>', methods=['DELETE'])
def delete_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return {"error": "User not found"}, 404

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

@auth_bp.route('/user/<username>', methods=['PATCH'])
def update_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return {"error": "User not found"}, 404

    data = request.get_json()
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
        return {"message": f"User '{username}' updated successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to update user {e}"}, 500


