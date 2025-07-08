import hashlib
import json
import os
from datetime import datetime, date
from flask import current_app
import google.generativeai as genai
from models import db, UsageTracker, MessageLog
from dotenv import load_dotenv

load_dotenv()

def hash_ip_address(ip_address):
    """Hash IP address for privacy protection"""
    return hashlib.sha256(ip_address.encode()).hexdigest()

def check_and_update_limit(ip_address):
    """
    Check and update rate limit for a visitor
    Returns True if within limit, False if limit exceeded
    """
    visitor_id = hash_ip_address(ip_address)
    today = date.today()
    
    # Get or create usage tracker for this visitor
    usage_tracker = UsageTracker.query.filter_by(visitor_id=visitor_id).first()
    
    if usage_tracker is None:
        # First time visitor
        usage_tracker = UsageTracker(
            visitor_id=visitor_id,
            message_count=1,
            last_request_date=today
        )
        db.session.add(usage_tracker)
    else:
        # Check if it's a new day
        if usage_tracker.last_request_date < today:
            # Reset count for new day
            usage_tracker.message_count = 1
            usage_tracker.last_request_date = today
        else:
            # Same day, check limit
            if usage_tracker.message_count >= 15:
                return False
            # Increment count
            usage_tracker.message_count += 1
    
    db.session.commit()
    return True

def log_message(visitor_id, role, content):
    """Log a message to the database"""
    message_log = MessageLog(
        visitor_id=visitor_id,
        role=role,
        content=content
    )
    db.session.add(message_log)
    db.session.commit()

def get_gemini_response(prompt):
    """
    Get response from Google Gemini AI
    Returns the AI response or None if error occurs
    """
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create a context-aware prompt for agricultural advice
        agricultural_context = f"""
        You are an agricultural expert specializing in Mozambican farming practices. 
        Provide helpful, practical advice for farmers in Mozambique.
        
        User question: {prompt}
        
        Please provide a clear, informative response that is:
        1. Specific to Mozambican agricultural conditions
        2. Practical and actionable
        3. Written in simple, understandable language
        4. Focused on sustainable farming practices
        """
        
        response = model.generate_content(agricultural_context)
        return response.text
        
    except Exception as e:
        current_app.logger.error(f"Error calling Gemini API: {str(e)}")
        return None

def load_predefined_qa():
    """Load predefined Q&A data from JSON file"""
    try:
        json_path = os.path.join(os.path.dirname(__file__), 'data', 'json', 'predefined_qa.json')
        with open(json_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        current_app.logger.error(f"Error loading predefined Q&A: {str(e)}")
        return {}

def get_random_predefined_qa(category, crop):
    """
    Get a random predefined Q&A for the given category and crop
    Returns a tuple of (prompt, answer) or (None, None) if not found
    """
    try:
        qa_data = load_predefined_qa()
        
        if category not in qa_data:
            return None, None
        
        import random
        qa_list = qa_data[category]
        
        if not qa_list:
            return None, None
        
        # Select a random Q&A pair
        qa_pair = random.choice(qa_list)
        
        # Replace [CROP] placeholder with actual crop name
        prompt = qa_pair['prompt'].replace('[CROP]', crop)
        answer = qa_pair['answer'].replace('[CROP]', crop)
        
        return prompt, answer
        
    except Exception as e:
        current_app.logger.error(f"Error getting predefined Q&A: {str(e)}")
        return None, None 