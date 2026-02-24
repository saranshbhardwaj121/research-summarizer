from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

# Create extension objects (not bound to app yet)
db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_class=Config):
    """Application factory function."""

    # Create Flask app
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    # Import models so user_loader is registered
    from app import models

    # Import and register blueprints
    from app.auth import auth_bp
    from app.routes import main_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(main_bp)

    return app