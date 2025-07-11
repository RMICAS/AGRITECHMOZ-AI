import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

try:
    # Import the Flask app from run.py
    from run import app
    
    # For cPanel hosting, we need to expose the app as 'application'
    application = app
    
    # Create database tables if they don't exist
    with app.app_context():
        from models import db
        db.create_all()
    
except Exception as e:
    # If there's an error, create a simple error app
    from flask import Flask
    error_app = Flask(__name__)
    
    @error_app.route('/')
    def error():
        return f"Error loading application: {str(e)}", 500
    
    @error_app.route('/health')
    def health():
        return "Error loading main application", 500
    
    application = error_app

if __name__ == "__main__":
    application.run() 