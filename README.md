# Research Summarizer

AI-powered research paper summarizer built with Flask.

## Features

- User authentication (register/login/logout)
- Search research papers using arXiv API
- Fetch top 3 research papers based on query
- Display title, abstract, and publication date
- Clean Flask project structure
- Environment variable security using `.env`
- AJAX-based search (no page reload)

## Tech Stack

- Flask
- Flask-Login
- Flask-SQLAlchemy
- SQLite
- arXiv API
- HTML/CSS (Jinja Templates)
- JavaScript (AJAX)
- Git & GitHub

## Setup Instructions

1. Clone the repository
2. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
3. Create a `.env` file:

SECRET_KEY=your_secret_key
DATABASE_URI=sqlite:///app.db
GEMINI_API_KEY=your_api_key (if applicable)

4. Install dependencies:

pip install -r requirements.txt

5. Run the application:

python run.py