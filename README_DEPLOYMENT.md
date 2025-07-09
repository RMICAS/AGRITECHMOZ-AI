# AgritechMoz Chat - Deployment Guide for Namecheap cPanel

## Prerequisites
- Namecheap hosting account with Python support
- cPanel access
- Python 3.8+ enabled on your hosting

## Deployment Steps

### 1. Upload Files
1. Upload all project files to your hosting directory (usually `public_html` or a subdomain)
2. Ensure the following files are in the root directory:
   - `passenger_wsgi.py`
   - `run.py`
   - `requirements.txt`
   - `.htaccess`
   - All other project files

### 2. Set Up Python Environment
1. In cPanel, go to "Setup Python App"
2. Create a new Python application
3. Set Python version to 3.8 or higher
4. Set the application root to your project directory
5. Set the application startup file to `passenger_wsgi.py`

### 3. Install Dependencies
1. In cPanel, go to "Terminal" or use SSH
2. Navigate to your project directory
3. Run: `pip install -r requirements.txt`

### 4. Environment Variables
1. Create a `.env` file in your project root with:
```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///agritech_chat.db
```

### 5. Database Setup
The SQLite database will be created automatically when the app first runs.

### 6. File Permissions
Ensure the following directories have write permissions:
- `instance/` (for database)
- `static/` (for static files)

### 7. Test the Application
1. Visit your domain/subdomain
2. The app should load and show the AgritechMoz Chat interface
3. Test the chat functionality

## Troubleshooting

### Common Issues:
1. **500 Error**: Check Python version compatibility
2. **Import Errors**: Ensure all dependencies are installed
3. **Database Errors**: Check file permissions for the instance directory
4. **API Errors**: Verify GEMINI_API_KEY is set correctly

### Logs:
- Check cPanel error logs
- Check Python application logs in cPanel

## Security Notes
- Keep your `.env` file secure and don't commit it to version control
- The app runs in production mode (debug=False)
- SQLite database is suitable for testing but consider PostgreSQL for production

## File Structure
```
your_project/
├── passenger_wsgi.py      # cPanel entry point
├── run.py                 # Flask app
├── requirements.txt       # Python dependencies
├── .htaccess             # Apache configuration
├── .env                  # Environment variables (create this)
├── static/               # Static files
├── templates/            # HTML templates
├── data/                 # JSON data
└── instance/             # Database (created automatically)
``` 