# Use the official Python image
FROM python:3.9-slim

# Update package lists
RUN apt-get update && apt-get upgrade -y

# Install dependencies for Firefox (explicitly include libgtk-3-dev)
RUN apt-get install -y firefox-esr libgtk-3-dev curl

# Download and install Geckodriver (consider version compatibility)
RUN curl -L https://github.com/mozilla/geckodriver/releases/download/v0.35.0/geckodriver-v0.35.0-linux64.tar.gz -o geckodriver.tar.gz && \
    tar -xzf geckodriver.tar.gz && \
    mv geckodriver /usr/local/bin/ && \
    chmod +x /usr/local/bin/geckodriver && \
    rm geckodriver.tar.gz

RUN geckodriver --version

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

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "web-automation-app:app"]
