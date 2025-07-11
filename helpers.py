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
            if usage_tracker.message_count >= 100:
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
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Cria um prompt para respostas agrícolas e gerais em português de Portugal
        agricultural_context = f"""
IMPORTANTE: A tua resposta DEVE ter MÁXIMO 120 PALAVRAS. Não excedas este limite.

És o AgritechMoz Chat, um assistente de IA criado para ajudar agricultores em Moçambique com conselhos agrícolas e para responder a perguntas gerais.

REGRAS OBRIGATÓRIAS:
1. MÁXIMO 120 PALAVRAS por resposta
2. Responde sempre em português de Portugal
3. Sê conciso e direto
4. Usa listas com bullet points quando apropriado
5. Mantém o contexto da conversa ao longo da sessão
6. NÃO te apresentes novamente se já foste apresentado na sessão atual

Objetivo Principal:
- Para perguntas agrícolas: Dá conselhos práticos adaptados à realidade de Moçambique
- Para perguntas gerais: Responde de forma útil e clara
- Para perguntas pessoais: Só te apresenta se for a primeira interação da sessão

Estilo de Comunicação:
- Sê simpático, claro e acessível
- Usa linguagem simples e informal
- Foca-te em conselhos práticos e exemplos locais
- Mantém consistência no tom e estilo ao longo da conversa

Formatação de Listas:
- Quando criares listas, cada item deve começar numa linha nova
- Para listas com bullet points, usa o símbolo • (ponto médio):
  • Primeiro item
  • Segundo item
  • Terceiro item

- Para listas numeradas:
  1. Primeiro passo
  2. Segundo passo
  3. Terceiro passo

- Cada item da lista deve estar numa linha separada
- NUNCA coloques múltiplos itens na mesma linha
- SEMPRE usa • (ponto médio) para bullet points, NÃO asteriscos (*)

Pergunta do Utilizador: {prompt}

RESPONDE COM MÁXIMO 120 PALAVRAS em português de Portugal.
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

def get_random_predefined_qa(category, crop, visitor_id=None):
    """
    Get a random predefined Q&A for the given category and crop
    Tracks used questions per visitor to avoid repetition
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
        
        # If visitor_id is provided, track used questions
        if visitor_id:
            # Get used questions for this visitor and category
            used_questions = get_used_questions(visitor_id, category)
            
            # Filter out already used questions
            available_questions = [qa for i, qa in enumerate(qa_list) if i not in used_questions]
            
            if not available_questions:
                # All questions used, return None
                return None, None
            
            # Select from available questions
            qa_pair = random.choice(available_questions)
            
            # Mark this question as used
            mark_question_as_used(visitor_id, category, qa_list.index(qa_pair))
        else:
            # Fallback to random selection if no visitor tracking
            qa_pair = random.choice(qa_list)
        
        # Replace [CROP] placeholder with actual crop name
        prompt = qa_pair['prompt'].replace('[CROP]', crop)
        answer = qa_pair['answer'].replace('[CROP]', crop)
        
        return prompt, answer
        
    except Exception as e:
        current_app.logger.error(f"Error getting predefined Q&A: {str(e)}")
        return None, None

def get_used_questions(visitor_id, category):
    """
    Get list of used question indices for a visitor and category
    """
    try:
        # This would typically be stored in a database
        # For now, we'll use a simple in-memory approach
        # In production, you'd want to store this in the database
        return []
    except Exception as e:
        current_app.logger.error(f"Error getting used questions: {str(e)}")
        return []

def mark_question_as_used(visitor_id, category, question_index):
    """
    Mark a question as used for a visitor and category
    """
    try:
        # This would typically be stored in a database
        # For now, we'll use a simple in-memory approach
        # In production, you'd want to store this in the database
        pass
    except Exception as e:
        current_app.logger.error(f"Error marking question as used: {str(e)}") 