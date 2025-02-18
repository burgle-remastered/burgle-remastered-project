import os
from flask import Blueprint, send_from_directory
from app.extensions import db

main_bp = Blueprint("main", __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Gets 'routes/' folder path 
STATIC_DIR = os.path.join(BASE_DIR, '..', 'static')  # Moves up and into 'static/fonts'

@main_bp.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

# font route
@main_bp.route('/static/fonts/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(STATIC_DIR, "fonts"), filename)

# 3D model 
@main_bp.route('/static/ThreeJSModels/<path:filename>')
def serve_model(filename):
    return send_from_directory(os.path.join(STATIC_DIR, "models"), filename)


# @font-face {
#     font-family: 'MyCustomFont';
#     src: url('/static/fonts/myFont.ttf') format('truetype');
#     font-weight: normal;
#     font-style: normal;
# }

# body {
#     font-family: 'MyCustomFont', sans-serif;
# }