from flask import Blueprint, send_from_directory
from app.extensions import db

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    return "Welcome to the Flask PostgreSQL App!"

@main_bp.route('/')
def index():
    return send_from_directory('static', 'index.html')

@main_bp.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# @font-face {
#     font-family: 'MyCustomFont';
#     src: url('/static/fonts/myFont.ttf') format('truetype');
#     font-weight: normal;
#     font-style: normal;
# }

# body {
#     font-family: 'MyCustomFont', sans-serif;
# }