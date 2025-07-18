# cPanel Deployment Guide

## Prerequisites

1. Make sure you have Python 3.9+ enabled in your cPanel
2. Ensure all required packages are installed

## Files Structure

Your application should have these key files:
- `passenger_wsgi.py` - WSGI entry point for cPanel
- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `.env` - Environment variables (create this file)

## Environment Variables

Create a `.env` file in your root directory with:

```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///agritech_chat.db
```

## Installation Steps

1. Upload all files to your cPanel directory
2. In cPanel, go to "Setup Python App"
3. Create a new Python app pointing to your directory
4. Set the Python version to 3.9 or higher
5. Set the application root to your directory
6. Set the application URL to your domain/subdomain
7. Set the application startup file to `passenger_wsgi.py`

## Database Setup

The application will automatically create the SQLite database when it starts. Make sure the directory has write permissions.

## Troubleshooting

### Common Issues:

1. **Import Errors**: Make sure all files are uploaded and `requirements.txt` is in the root directory
2. **Database Errors**: Check write permissions for the directory
3. **Environment Variables**: Ensure `.env` file is uploaded and contains correct values
4. **Python Version**: Make sure Python 3.9+ is selected in cPanel

### Debug Steps:

1. Check the error logs in cPanel
2. Test the import locally: `python -c "from app import app; print('OK')"`
3. Verify all dependencies are installed
4. Check file permissions

## Health Check

Once deployed, you can test the application by visiting:
- `https://yourdomain.com/` - Main application
- `https://yourdomain.com/api/health` - Health check endpoint

## Support

If you encounter issues:
1. Check cPanel error logs
2. Verify all files are uploaded correctly
3. Ensure environment variables are set
4. Test the application locally first 