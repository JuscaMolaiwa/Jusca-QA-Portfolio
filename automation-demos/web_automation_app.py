import os
import time
import traceback
import logging

from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from selenium import webdriver
from chromedriver_py import binary_path

from page_objects.login_page import LoginPage
from page_objects.place_order import OrderPage

# ── Logging setup ─────────────────────────────────────────────────────────────
# Logs appear in PythonAnywhere's error log tab
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
log = logging.getLogger(__name__)

app = Flask(__name__)

# Disable caching for all responses in development
# Change max_age to a higher value once stable in production
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.after_request
def add_cache_headers(response):
    if response.content_type and "text/html" in response.content_type:
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS(app, resources={
    r"/run-login-test":  {"origins": ["https://jusca.pythonanywhere.com", "https://juscamolaiwa.github.io"]},
    r"/place-order":     {"origins": ["https://jusca.pythonanywhere.com", "https://juscamolaiwa.github.io"]},
    r"/submit-feedback": {"origins": ["https://jusca.pythonanywhere.com", "https://juscamolaiwa.github.io"]},
    r"/feedbacks":       {"origins": ["https://jusca.pythonanywhere.com", "https://juscamolaiwa.github.io"]}
})

# ── JWT ───────────────────────────────────────────────────────────────────────
app.config['JWT_SECRET_KEY'] = 'jw-secret-key'
jwt = JWTManager(app)

users = {
    "admin": "passsword",
    "user1": "password1"
}

# ── MySQL ─────────────────────────────────────────────────────────────────────
app.config['MYSQL_HOST']     = 'MySQL host address'
app.config['MYSQL_USER']     = 'MySQL username'
app.config['MYSQL_PASSWORD'] = 'MySQL password'
app.config['MYSQL_DB']       = 'MySQL database name'

mysql = MySQL(app)

# ── Screenshot directory — use a path relative to this file ──────────────────
# Absolute paths like /home/Jusca/... break if the username or folder changes.
BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
SCREENSHOT_DIR = os.path.join(BASE_DIR, 'screenshots')
VIDEO_DIR      = os.path.join(BASE_DIR, 'automation-vids')
LOG_DIR        = os.path.join(BASE_DIR, 'automation-logs')

def ensure_dirs():
    """Create artifact directories if they don't exist."""
    for d in (SCREENSHOT_DIR, VIDEO_DIR, LOG_DIR):
        os.makedirs(d, exist_ok=True)

# ── Chrome driver builder ─────────────────────────────────────────────────────
def build_driver():
    """
    Build a headless Chrome WebDriver.
    Logs the chromedriver path so you can verify it in PythonAnywhere's error log.
    """
    log.info(f"chromedriver binary path: {binary_path}")
    log.info(f"chromedriver exists: {os.path.exists(binary_path)}")

    svc     = webdriver.ChromeService(executable_path=binary_path)
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    # Required on some Linux environments
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-setuid-sandbox")
    options.add_argument("--remote-debugging-port=0")

    driver = webdriver.Chrome(service=svc, options=options)
    log.info("Chrome launched successfully")
    return driver

def save_screenshot(driver, name):
    """Save a screenshot and return the relative URL, or None on failure."""
    ensure_dirs()
    path = os.path.join(SCREENSHOT_DIR, name)
    try:
        driver.save_screenshot(path)
        log.info(f"Screenshot saved: {path}")
        return f'/screenshots/{name}'
    except Exception as e:
        log.error(f"Failed to save screenshot: {e}")
        return None

# ── Static asset routes ───────────────────────────────────────────────────────

@app.route('/screenshots/<path:filename>')
def serve_screenshot(filename):
    return send_from_directory(SCREENSHOT_DIR, filename)

@app.route('/automation-logs/<path:filename>')
def serve_log(filename):
    return send_from_directory(LOG_DIR, filename)

@app.route('/automation-vids/<path:filename>')
def serve_video(filename):
    return send_from_directory(VIDEO_DIR, filename)


# ── Login test ────────────────────────────────────────────────────────────────

@app.route('/run-login-test', methods=['POST'])
def run_test():
    driver          = None
    screenshot_url  = None

    try:
        log.info("=== /run-login-test started ===")
        driver     = build_driver()
        login_page = LoginPage(driver)

        log.info("Navigating to saucedemo.com")
        driver.get("https://www.saucedemo.com/")
        log.info(f"Page title: {driver.title}")

        log.info("Performing login")
        login_page.perform_login("standard_user", "secret_sauce")

        timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")

        if login_page.is_login_successful():
            result         = "Login successful 🎉🎉!"
            screenshot_url = save_screenshot(driver, f"{timestamp}_login_successful.png")
            log.info(result)
        else:
            result         = "Login failed ❌"
            screenshot_url = save_screenshot(driver, f"{timestamp}_login_failed.png")
            log.warning(result)

    except Exception as e:
        # Log the full traceback — visible in PythonAnywhere error log
        log.error(f"run_test exception: {e}\n{traceback.format_exc()}")
        result = f"Error occurred: {str(e)}"
        return jsonify({'error': str(e), 'result': result, 'traceback': traceback.format_exc()}), 500

    finally:
        if driver:
            driver.quit()
            log.info("Driver closed")

    log.info("=== /run-login-test complete ===")
    return jsonify({'result': result, 'screenshot': screenshot_url})


# ── Place order ───────────────────────────────────────────────────────────────

@app.route('/place-order', methods=['POST'])
def place_order():
    driver         = None
    screenshot_url = None

    try:
        log.info("=== /place-order started ===")
        driver     = build_driver()
        login_page = LoginPage(driver)

        log.info("Navigating to saucedemo.com")
        driver.get("https://www.saucedemo.com/")
        log.info(f"Page title: {driver.title}")

        timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")

        log.info("Performing login")
        if login_page.perform_login("standard_user", "secret_sauce"):
            log.info("Login successful, proceeding to place order")
            order_page = OrderPage(driver)

            if order_page.place_order("Jusca", "Tester", "2191"):
                result         = "Order placed successfully 🛒✅"
                screenshot_url = save_screenshot(driver, f"{timestamp}_order_success.png")
                log.info(result)
            else:
                result         = "Order placement failed ❌"
                screenshot_url = save_screenshot(driver, f"{timestamp}_order_failed.png")
                log.warning(result)
        else:
            result         = "Login failed ❌"
            screenshot_url = save_screenshot(driver, f"{timestamp}_login_failed.png")
            log.warning(result)

    except Exception as e:
        log.error(f"place_order exception: {e}\n{traceback.format_exc()}")
        result = f"Error occurred: {str(e)}"
        return jsonify({'error': str(e), 'result': result, 'traceback': traceback.format_exc()}), 500

    finally:
        if driver:
            driver.quit()
            log.info("Driver closed")

    log.info("=== /place-order complete ===")
    return jsonify({'result': result, 'screenshot': screenshot_url})


# ── Feedback ──────────────────────────────────────────────────────────────────

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    # form.js sends Content-Type: application/json via fetch()
    # request.form only reads multipart/form-data or x-www-form-urlencoded
    if request.is_json:
        data    = request.get_json(silent=True) or {}
        name    = data.get('name',    '').strip()
        email   = data.get('email',   '').strip()
        message = data.get('message', '').strip()
    else:
        name    = (request.form.get('name')    or '').strip()
        email   = (request.form.get('email')   or '').strip()
        message = (request.form.get('message') or '').strip()

    log.info(f"Feedback received — name='{name}' email='{email}' message_len={len(message)}")

    if not name or not email or not message:
        log.warning("Feedback rejected — missing fields")
        return jsonify({'status': 'error', 'message': 'All fields are required.'}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO feedback (name, email, message) VALUES (%s, %s, %s)",
            (name, email, message)
        )
        mysql.connection.commit()
        cursor.close()
        log.info("Feedback saved to database")
    except Exception as e:
        log.error(f"DB error: {e}\n{traceback.format_exc()}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

    return jsonify({
        'status':  'success',
        'message': f'Hi {name}! Your feedback was submitted successfully!'
    })


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if username in users and users[username] == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/feedbacks', methods=['GET'])
@jwt_required()
def get_feedbacks():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM feedback")
        results = cursor.fetchall()
        cursor.close()

        feedbacks = [
            {'id': row[0], 'name': row[1], 'email': row[2], 'message': row[3], 'created_at': row[4]}
            for row in results
        ]
        return jsonify(feedbacks), 200
    except Exception as e:
        log.error(f"get_feedbacks error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)