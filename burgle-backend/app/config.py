import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("postgresql://postgres@localhost/burgle")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
