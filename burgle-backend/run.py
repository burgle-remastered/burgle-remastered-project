# from app import create_app
# from app import create_app, db
# from flask_migrate import Migrate
# from app import models

# app = create_app()

# # Register Migrate with the app
# migrate = Migrate(app, db)

# # For Flask CLI to recognize Migrate commands
# print("App instance created:", app)
# print("Extensions:", app.extensions)
# if __name__ == "__main__":
#     app.run(debug=True)
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)