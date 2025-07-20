from flask import Flask, render_template, request, jsonify, redirect, url_for
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

print(f"--- Is Gemini API Key Loaded? -> {os.getenv('GEMINI_API_KEY')}")

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///agritech_chat.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route('/')
def index():
    """Rota principal - mostra a interface do chat"""
    return render_template('index.html')

@app.route('/api/predefined', methods=['GET'])
def get_predefined_qa():
    """Obter perguntas e respostas pré-definidas com base na cultura e fase"""
    try:
        ip_address = request.remote_addr
        if not check_and_update_limit(ip_address):
            return jsonify({'error': 'Atingiu o limite diário de mensagens.'}), 429
        crop = request.args.get('crop', '').lower()
        stage = request.args.get('stage', '').lower()
        if not crop or not stage:
            return jsonify({'error': 'Falta o parâmetro cultura ou fase.'}), 400
        visitor_id = hash_ip_address(ip_address)
        prompt, answer = get_random_predefined_qa(stage, crop, visitor_id)
        if not prompt or not answer:
            return jsonify({'error': 'Não foram encontradas perguntas e respostas para esta cultura e fase.'}), 404
        log_message(visitor_id, 'user', f"Pediu conselho para a fase {stage} da cultura {crop}")
        log_message(visitor_id, 'assistant', answer)
        return jsonify({'prompt': prompt, 'answer': answer, 'crop': crop, 'stage': stage})
    except Exception as e:
        app.logger.error(f"Erro no endpoint de perguntas e respostas pré-definidas: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor.'}), 500

@app.route('/api/send_message', methods=['POST'])
def send_message():
    """Enviar mensagem para a IA Gemini e obter resposta"""
    try:
        ip_address = request.remote_addr
        if not check_and_update_limit(ip_address):
            return jsonify({'error': 'Atingiu o limite diário de mensagens.'}), 429
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'A mensagem é obrigatória.'}), 400
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'A mensagem não pode estar vazia.'}), 400
        visitor_id = hash_ip_address(ip_address)
        ai_response = get_gemini_response(user_message, visitor_id)
        if ai_response is None:
            return jsonify({'error': 'Não foi possível obter resposta da IA. Tente novamente mais tarde.'}), 500
        log_message(visitor_id, 'user', user_message)
        log_message(visitor_id, 'assistant', ai_response)
        return jsonify({'response': ai_response, 'message': user_message})
    except Exception as e:
        app.logger.error(f"Erro no endpoint de envio de mensagem: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor.'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificação de saúde"""
    return jsonify({'status': 'saudável', 'message': 'A API do AgritechMoz Chat está a funcionar'})

# Gestores de erros
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Erro interno do servidor.'}), 500

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Run the application
    app.run(debug=False, host='0.0.0.0', port=5000) 