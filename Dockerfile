# Backend (Flask)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/

# Install backend dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy frontend build (if exists)
COPY frontend/dist ./frontend/dist

# Expose port
EXPOSE 8080

# Run Flask via gunicorn
CMD ["gunicorn", "--chdir", "backend", "app:app", "-b", "0.0.0.0:8080"]
