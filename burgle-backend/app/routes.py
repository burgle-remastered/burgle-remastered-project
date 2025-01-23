from flask import Blueprint
from app.extensions import db

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    return "Welcome to the Flask PostgreSQL App!"
