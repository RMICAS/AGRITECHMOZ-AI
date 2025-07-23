from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class UsageTracker(db.Model):
    __tablename__ = 'usage_tracker'
    
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.String(64), unique=True, nullable=False)
    message_count = db.Column(db.Integer, default=0, nullable=False)
    last_request_date = db.Column(db.Date, default=datetime.utcnow().date(), nullable=False)
    
    def __repr__(self):
        return f'<UsageTracker {self.visitor_id}: {self.message_count} messages on {self.last_request_date}>'

class MessageLog(db.Model):
    __tablename__ = 'message_log'
    
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.String(64), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'user' or 'assistant'
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<MessageLog {self.visitor_id}: {self.role} at {self.timestamp}>'

class UsedPredefinedQuestion(db.Model):
    __tablename__ = 'used_predefined_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.String(64), nullable=False)
    category = db.Column(db.String(20), nullable=False)  # 'sowing', 'growth', 'harvest', 'financial'
    question_index = db.Column(db.Integer, nullable=False)  # Index of the question in the predefined list
    used_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Composite unique constraint to prevent duplicate tracking
    __table_args__ = (db.UniqueConstraint('visitor_id', 'category', 'question_index', name='unique_visitor_category_question'),)
    
    def __repr__(self):
        return f'<UsedPredefinedQuestion {self.visitor_id}: {self.category} question {self.question_index}>' 