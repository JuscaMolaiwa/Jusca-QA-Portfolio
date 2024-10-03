# Use the official Python image
FROM python:3.12-slim

# Update package list and install Firefox and required utilities
RUN apt-get update                             \
 && apt-get install -y --no-install-recommends \
    ca-certificates curl firefox-esr           \
 && rm -fr /var/lib/apt/lists/*                \
 && curl -L https://github.com/mozilla/geckodriver/releases/download/v0.30.0/geckodriver-v0.30.0-linux64.tar.gz | tar xz -C /usr/local/bin \
 && apt-get purge -y ca-certificates curl

 RUN apt-get update && apt-get install -y \
 firefox-esr \
 libgtk-3-0 \
 libdbus-glib-1-2 \
 libxt6 \
 libxrender1 \
 libasound2

 # Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install ffmpeg and other required packages
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements.txt to the container
COPY requirements.txt .

# Install dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the entire application into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000
EXPOSE 4444

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "web_automation_app:app"]
