from flask import Flask, render_template, request, jsonify
from models import db, UsageTracker, MessageLog
from helpers import (
    check_and_update_limit, 
    log_message, 
    get_gemini_response, 
    get_random_predefined_qa,
    hash_ip_address
)
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///agritech_chat.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route('/')
def index():
    """Main route - render the chat interface"""
    return render_template('index.html')

@app.route('/api/predefined', methods=['GET'])
def get_predefined_qa():
    """Get predefined Q&A based on crop and stage"""
    try:
        # Get user's IP address
        ip_address = request.remote_addr
        
        # Check rate limit
        if not check_and_update_limit(ip_address):
            return jsonify({'error': 'You have reached the daily message limit.'}), 429
        
        # Get parameters from request
        crop = request.args.get('crop', '').lower()
        stage = request.args.get('stage', '').lower()
        
        if not crop or not stage:
            return jsonify({'error': 'Missing crop or stage parameter'}), 400
        
        # Get random predefined Q&A
        prompt, answer = get_random_predefined_qa(stage, crop)
        
        if not prompt or not answer:
            return jsonify({'error': 'No predefined Q&A found for this crop and stage'}), 404
        
        # Log the interaction
        visitor_id = hash_ip_address(ip_address)
        log_message(visitor_id, 'user', f"Requested {stage} advice for {crop}")
        log_message(visitor_id, 'assistant', answer)
        
        return jsonify({
            'prompt': prompt,
            'answer': answer,
            'crop': crop,
            'stage': stage
        })
        
    except Exception as e:
        app.logger.error(f"Error in predefined Q&A endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/send_message', methods=['POST'])
def send_message():
    """Send message to Gemini AI and get response"""
    try:
        # Get user's IP address
        ip_address = request.remote_addr
        
        # Check rate limit
        if not check_and_update_limit(ip_address):
            return jsonify({'error': 'You have reached the daily message limit.'}), 429
        
        # Get message from request body
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get AI response
        ai_response = get_gemini_response(user_message)
        
        if ai_response is None:
            return jsonify({'error': 'Unable to get AI response. Please try again later.'}), 500
        
        # Log the interaction
        visitor_id = hash_ip_address(ip_address)
        log_message(visitor_id, 'user', user_message)
        log_message(visitor_id, 'assistant', ai_response)
        
        return jsonify({
            'response': ai_response,
            'message': user_message
        })
        
    except Exception as e:
        app.logger.error(f"Error in send message endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'AgritechMoz Chat API is running'})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000) 