from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, current_user, login_required

from app import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    """Register new user. GET shows form, POST processes registration."""
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        # Validate required fields
        if not username or not email or not password:
            flash("Username, email and password are required.", "error")
            return render_template("register.html")

        # Check username uniqueness
        if User.query.filter_by(username=username).first():
            flash(f"Username '{username}' is already taken.", "error")
            return render_template("register.html")

        # Check email uniqueness
        if User.query.filter_by(email=email).first():
            flash(f"Email '{email}' is already registered.", "error")
            return render_template("register.html")

        # Create user, hash password, save to DB
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash("Registration successful. Please log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("register.html")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    """Log user in. GET shows form, POST validates and logs in."""
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        if not username or not password:
            flash("Username and password are required.", "error")
            return render_template("login.html")

        user = User.query.filter_by(username=username).first()

        if user is None or not user.check_password(password):
            flash("Invalid username or password.", "error")
            return render_template("login.html")

        login_user(user)
        flash("Welcome back!", "success")
        return redirect(url_for("main.dashboard"))

    return render_template("login.html")


@auth_bp.route("/logout")
@login_required
def logout():
    """Log user out and redirect to login."""
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))
