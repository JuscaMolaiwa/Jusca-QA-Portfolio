#!/bin/bash
set -e

echo "Pulling latest from GitHub..."
cd ~/JUSCA-QA-PORTFOLIO
git pull origin main

echo "Reloading PythonAnywhere app..."
touch /var/www/jusca_pythonanywhere_com_wsgi.py

echo "Done! App reloaded."