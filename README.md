# AgritechMoz Chat - Backend Edition

An interactive agricultural chatbot designed specifically for Mozambican farmers, now with a Flask backend, rate limiting, and Google Gemini AI integration.

## Features

- **Flask Backend**: Robust server-side processing with SQLAlchemy database
- **Anonymous Rate Limiting**: 15 messages per day per IP address (hashed for privacy)
- **Google Gemini AI Integration**: Advanced AI responses for agricultural queries
- **Predefined Q&A System**: Curated agricultural advice for specific crops and stages
- **Interactive Card-based Interface**: Four agricultural stages (Sowing, Growth, Harvest, Financial)
- **Mobile-responsive Design**: Optimized for all device sizes
- **Region-specific Recommendations**: Tailored for Mozambican farming conditions

## Technologies Used

### Backend
- **Flask**: Web framework for Python
- **Flask-SQLAlchemy**: Database ORM
- **Google Generative AI**: Advanced AI responses
- **SQLite**: Lightweight database (can be changed to PostgreSQL/MySQL for production)

### Frontend
- **HTML5/CSS3**: Modern web standards
- **JavaScript (ES6+)**: Interactive functionality
- **Bootstrap 5**: Responsive UI framework
- **Font Awesome**: Icon library

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Google Gemini API key

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd AgritechMoz-Chat
```

2. **Create and activate virtual environment**:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

5. **Run the application**:
```bash
python run.py
```

6. **Access the application**:
   - Open your browser and go to `http://localhost:5000`

## Project Structure

```
AgritechMoz-Chat/
├── run.py                 # Main Flask application
├── models.py              # Database models
├── helpers.py             # Helper functions (rate limiting, AI calls)
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── templates/
│   └── index.html        # Main chat interface
├── static/               # Static files
│   ├── css/
│   │   └── styles.css    # CSS styles
│   ├── js/
│   │   └── chat.js       # Frontend JavaScript
│   └── images/
│       └── Agritech-logo-full-green.png  # Logo
├── data/
│   └── json/
│       └── predefined_qa.json  # Agricultural Q&A database
└── README.md             # Comprehensive documentation
```

## API Endpoints

### `GET /`
- **Purpose**: Main chat interface
- **Response**: HTML page

### `GET /api/predefined`
- **Purpose**: Get predefined Q&A for specific crop and stage
- **Parameters**: 
  - `crop` (string): Crop name (e.g., "tomato", "maize")
  - `stage` (string): Agricultural stage (e.g., "sowing", "growth", "harvest", "financial")
- **Response**: JSON with prompt and answer
- **Rate Limited**: Yes (15 messages/day)

### `POST /api/send_message`
- **Purpose**: Send message to Gemini AI
- **Body**: JSON with `message` field
- **Response**: JSON with AI response
- **Rate Limited**: Yes (15 messages/day)

### `GET /api/health`
- **Purpose**: Health check endpoint
- **Response**: JSON status

## Database Models

### UsageTracker
- Tracks daily message usage per visitor (hashed IP)
- Fields: `id`, `visitor_id`, `message_count`, `last_request_date`

### MessageLog
- Logs all user and AI messages
- Fields: `id`, `visitor_id`, `role`, `content`, `timestamp`

## Rate Limiting

- **Limit**: 15 messages per day per IP address
- **Privacy**: IP addresses are hashed using SHA256
- **Reset**: Daily at midnight UTC
- **Storage**: SQLite database (can be changed for production)

## Agricultural Categories

### 🌱 Sowing
- Planting time recommendations
- Soil preparation guidance
- Crop-specific spacing advice
- Regional variety recommendations

### 🌿 Growth
- Irrigation schedules
- Pest control methods
- Fertilization guidance
- Plant health monitoring

### 🚜 Harvest
- Harvest timing indicators
- Post-harvest handling
- Storage recommendations
- Quality control measures

### 💰 Financial Analysis
- Cost calculations
- ROI estimations
- Market pricing guidance
- Investment planning

## Supported Crops

- Tomato
- Carrot
- Onions
- Kale
- Cabbage
- Maize
- Rice
- Cassava
- Beans
- Cotton

## Environment Variables

Create a `.env` file with the following variables:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here

# Flask Configuration (optional)
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///agritech_chat.db
```

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Using Docker (example)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

## Security Features

- **IP Hashing**: Visitor IPs are hashed for privacy
- **Rate Limiting**: Prevents abuse
- **Input Validation**: All inputs are validated
- **Error Handling**: Comprehensive error handling
- **SQL Injection Protection**: Using SQLAlchemy ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on the GitHub repository. 