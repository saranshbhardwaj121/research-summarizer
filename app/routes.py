from flask import Blueprint, redirect, render_template, url_for, request, jsonify
from flask_login import current_user, login_required

from app.arxiv_service import fetch_papers
from app.gemini_service import summarize_text

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    """Root route: redirect based on authentication status."""
    if not current_user.is_authenticated:
        return redirect(url_for("auth.login"))
    return redirect(url_for("main.dashboard"))


@main_bp.route("/dashboard")
@login_required
def dashboard():
    """Protected dashboard page."""
    return render_template("dashboard.html")


@main_bp.route("/search", methods=["POST"])
@login_required
def search():
    """
    Handle paper search request.
    Fetch papers from arXiv and summarize them using Gemini.
    Returns JSON response.
    """
    query = request.form.get("query", "").strip()

    if not query:
        return jsonify({"papers": [], "error": "Query is required."}), 400

    papers = fetch_papers(query)

    # Generate summaries using Gemini
    for paper in papers:
        summary = summarize_text(paper["abstract"])
        paper["summary"] = summary

    return jsonify({"papers": papers})