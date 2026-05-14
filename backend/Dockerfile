# ============================================
# BASE IMAGE
# Start with an official Python 3.11 image
# slim means smaller file size — no extras
# ============================================
FROM python:3.11-slim

# ============================================
# WORKING DIRECTORY
# All commands will run from this folder
# inside the container
# ============================================
WORKDIR /app

# ============================================
# INSTALL DEPENDENCIES
# Copy requirements first so Docker can cache
# this layer — only reinstalls if requirements
# changes, not every time code changes
# ============================================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ============================================
# COPY CODE
# Copy all backend code into the container
# ============================================
COPY . .

# ============================================
# EXPOSE PORT
# Tell Docker this app runs on port 8000
# ============================================
EXPOSE 8000

# ============================================
# START COMMAND
# This runs when the container starts
# ============================================
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]