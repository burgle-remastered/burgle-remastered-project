# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from models import *
# import os
# from dotenv import load_dotenv

# load_dotenv()
# print("It works!")

# migrate = Migrate()

# app = Flask(__name__)
# CORS(app)


# db = SQLAlchemy(app)
# def create_app():
#     app = Flask(__name__)
#     app.config.from_object("app.config.Config")
#     app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///app.db')

#     # Initialize extensions with the app
#     db.init_app(app)
#     migrate.init_app(app, db)

#     # Register blueprints or routes
#     from routes import main_bp
#     app.register_blueprint(main_bp)

#     return app
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from app.extensions import db, migrate
from app.models.users import bcrypt, User
from app.models.burgers import Burger
from flask_login import LoginManager
from app.routes.auth import auth_bp
from app.routes.burgerroutes import burger_bp
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True,resources={r"*": {"origins": "http://localhost:5173"}},allow_headers=["Content-Type", "Authorization",'Access-Control-Allow-Methods','Access-Control-Allow-Headers','Access-Control-Allow-Origin'], methods=["PATCH", "OPTIONS",'POST','GET','DELETE'])
    
    # Direct database configuration without dotenv for now
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres@localhost/burgle"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'burgers'
    app.config['SESSION_COOKIE_NAME'] = 'burgl'
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # Ensures the cookie is not accessible via JavaScript
    app.config['SESSION_COOKIE_SECURE'] = False  # Only send cookies over HTTPS (set to False for local dev without HTTPS)
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Use Lax or Strict to restrict cross-site requests
    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)

    app.permanent_session_lifetime = timedelta(days=7)  
    
    login_manager = LoginManager(app)
    login_manager.login_view = "auth.login"

    # Import models after db initialization
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    def load_burger(user_id):
        return Burger.query.get(int(user_id))

# Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(burger_bp, url_prefix='/burger')


    # Register blueprints or routes
    from app.routes.routes import main_bp
    app.register_blueprint(main_bp)
    
    return app