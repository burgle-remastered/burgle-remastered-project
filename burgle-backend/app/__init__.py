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
from flask_cors import CORS
from app.extensions import db, migrate
from app.models import *

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Direct database configuration without dotenv for now
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres@localhost/burgle"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Import models after db initialization
    
    # Register blueprints or routes
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    return app