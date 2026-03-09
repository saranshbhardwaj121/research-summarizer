# Contributing to Research Summarizer

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/research_summarizer.git
   cd research_summarizer
   ```
3. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   ```
4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Set up environment variables** — copy `.env.example` to `.env` and fill in your keys.

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and test locally with `python run.py`.
3. Commit with a clear message:
   ```bash
   git commit -m "Add: brief description of change"
   ```
4. Push and open a Pull Request against `main`.

## What Can You Contribute?

- Bug fixes
- UI/UX improvements
- New features (paper bookmarking, export to PDF, etc.)
- Documentation improvements
- Test coverage

## Code Style

- Follow PEP 8 for Python code.
- Use meaningful variable and function names.
- Keep functions small and focused.

## Reporting Issues

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
