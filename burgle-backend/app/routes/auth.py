from flask import Blueprint, request, redirect, url_for, render_template, flash
from flask_login import login_user, logout_user, login_required
from app.models.models import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    #print("🔹 Received data:", data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    #print(f"🔹 Username: {username}, Email: {email}, Password: {password}")

    if not username or not email or not password:
        return {"error": "Email and password are required"}, 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "Email already registered"}, 400

    new_user = User(username=username,email=email)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        #print("✅ User successfully added to database!")  # Debugging statement
        return {"message": "Registration successful"}, 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"❌ Database Commit Error: {e}")  # Debugging statement
        return {"error": "Database error"}, 500


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials', 'danger')

    return render_template('login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
