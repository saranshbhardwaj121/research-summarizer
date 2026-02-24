import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Flask configuration class."""

    # Secret key for session management
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    # Get base directory of the project
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # SQLite database configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "app.db")

    # Disable modification tracking to save memory
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Gemini API Key
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")