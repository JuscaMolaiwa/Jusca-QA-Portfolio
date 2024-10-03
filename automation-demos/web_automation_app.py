import os
import time

from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

from flask import Flask, jsonify, request  # type: ignore
#from selenium.webdriver.chrome.service import Service  # type: ignore
#from webdriver_manager.chrome import ChromeDriverManager  # type: ignore
from selenium import webdriver  # type: ignore
from flask_cors import CORS  # type: ignore
from flask import send_from_directory # type: ignore
from chromedriver_py import binary_path

from page_objects.login_page import LoginPage
from page_objects.place_order import OrderPage
# from utilities.logs_util import setup_logging

app = Flask(__name__)
# Enable CORS for specific routes and origins
CORS(app, resources={
    r"/run-login-test": {"origins": "https://jusca.pythonanywhere.com/"},
     r"/place-order": {"origins": "https://jusca.pythonanywhere.com/"},
     r"/submit-feedback": {"origins": "https://jusca.pythonanywhere.com/"},
    r"/feedbacks": {"origins": "https://jusca.pythonanywhere.com/"}
})


# Configure JWT secret key
app.config['JWT_SECRET_KEY'] = 'jw-secret-key'  #
jwt = JWTManager(app)

# Dummy user credentials
users = {
    "admin": "passsword",
    "user1": "password1"
}


app.config['MYSQL_HOST'] = 'MySQL host address'  # Your MySQL host address
app.config['MYSQL_USER'] = 'MySQL username'  # Your MySQL username
app.config['MYSQL_PASSWORD'] = 'MySQL password'
app.config['MYSQL_DB'] = 'MySQL database name'  #  database nameName

mysql = MySQL(app)

# Route to serve screenshots
@app.route('/screenshots/<path:filename>')
def serve_screenshot(filename):
    return send_from_directory('/home/Jusca/JUSCA-QA-PORTFOLIO/automation-demos/screenshots', filename)

# Route to serve logs
@app.route('/automation-logs/<path:filename>')
def serve_log(filename):
    return send_from_directory("automation-logs", filename)

# Route to serve videos
@app.route('/automation-vids/<path:filename>')
def serve_video(filename):
    return send_from_directory('/home/Jusca/JUSCA-QA-PORTFOLIO/automation-demos/automation-vids', filename)

@app.route('/run-login-test', methods=['POST'])
def run_test():
    driver = None

    # log_file_path = setup_logging()

    screenshot_dir = "/home/Jusca/JUSCA-QA-PORTFOLIO/automation-demos/screenshots"
    screenshot_name = ""

    try:
        # Set up Chrome Service and options
        svc = webdriver.ChromeService(executable_path=binary_path)
        chrome_options = webdriver.ChromeOptions()

        # Add Chrome options
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # Initialize the driver
        driver = webdriver.Chrome(service=svc, options=chrome_options)
        driver.maximize_window()

        try:
            driver.get("https://www.saucedemo.com/")
        except Exception as e:
            print(f"Error occurred while accessing the URL: {e}")

        print(driver.title)  # Print the title of the page

        # Create an instance of the LoginPage
        login_page = LoginPage(driver)

        ## Perform login actions
        login_page.perform_login("standard_user","secret_sauce")

        # Create screenshots directory if it doesn't exist
        if not os.path.exists('screenshots'):
            os.makedirs('screenshots')

        # Check if login was successful
        if login_page.is_login_successful():
            result = "Login successful 🎉🎉!"
            print("Taking screenshot for successful login...")
            try:
                time.sleep(10)
                timestamp = time.strftime("%Y-%m-%d-%Hh:%Mm")
                screenshot_name = f"{timestamp}_login_successful.png"
                driver.save_screenshot(os.path.join(screenshot_dir, screenshot_name))
                print(f"Screenshot saved at: {os.path.join(screenshot_dir, screenshot_name)}")

            except Exception as e:
                    print(f"Failed to save screenshot: {e}")
        else:
            result = "Login failed ❌"
            print("Taking screenshot for failed login...")
            try:
                timestamp = time.strftime("%Y-%m-%d")
                screenshot_name = f"{timestamp}_login_failed.png"
                driver.save_screenshot(os.path.join(screenshot_dir,screenshot_name))
            except Exception as e:
                print(f"Failed to save screenshot: {e}")

    except Exception as e:
        result = f"Error occurred: {str(e)}"
        print(result)
        return jsonify({'error': str(e), 'result': result}), 500

    finally:
        # Ensure driver quits if it was created
        if driver:
            driver.quit()


    # Return JSON response with result and screenshot paths
    screenshot_url = f'/screenshots/{screenshot_name}' if screenshot_name else None
    #logs_url = f'/automation-logs/{os.path.basename(log_file_path)}'
    #video_url = f'/automation-vids/{video_name}'  # Update this line to create the video URL
    #report_url = '/allure-report'

    return jsonify({
    'result': result,
    'screenshot': screenshot_url
    #'logs': logs_url,
    #'video': video_url
    #'report': report_url
    })


@app.route('/place-order', methods=['POST'])
def place_order():
    driver = None
    screenshot_dir = "/home/Jusca/JUSCA-QA-PORTFOLIO/automation-demos/screenshots"
    screenshot_name = ""

    try:
        svc = webdriver.ChromeService(executable_path=binary_path)
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(service=svc, options=chrome_options)
        driver.maximize_window()

        driver.get("https://www.saucedemo.com/")
        login_page = LoginPage(driver)


        # Reuse the perform_login method
        if login_page.perform_login("standard_user", "secret_sauce"):
            result = "Login successful 🎉"
            # Now proceed to place an order

            order_page = OrderPage(driver)

            if order_page.place_order("Jusca", "Tester", "2191"):
                result = "Order placed successfully 🛒✅"
                screenshot_name = f"{time.strftime('%Y-%m-%d')}_order_success.png"
            else:
                result = "Order placement failed ❌"
                screenshot_name = f"{time.strftime('%Y-%m-%d')}_order_failed.png"
        else:
            result = "Login failed ❌"
            screenshot_name = f"{time.strftime('%Y-%m-%d')}_login_failed.png"

        driver.save_screenshot(os.path.join(screenshot_dir, screenshot_name))

    except Exception as e:
        result = f"Error occurred: {str(e)}"
        print(result)
        return jsonify({'error': str(e), 'result': result}), 500

    finally:
        if driver:
            driver.quit()

    screenshot_url = f'/screenshots/{screenshot_name}' if screenshot_name else None
    return jsonify({'result': result, 'screenshot': screenshot_url})


#FEEDBACK FORM AND DATABASE
@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    # Validate input (optional, but recommended)
    if not name or not email or not message:
        return jsonify({'status': 'error', 'message': 'All fields are required.'}), 400

    try:
        # Store the feedback entry in the MySQL database
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO feedback (name, email, message) VALUES (%s, %s, %s)", (name, email, message))
        mysql.connection.commit()
        cursor.close()
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

    return jsonify({
        'status': 'success',
        'message': f'Hi {name}! Your Feedback was submitted successfully!'
    })


# Route for logging in and generating a token
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if username in users and users[username] == password:
        # Generate an access token
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Invalid credentials"}), 401

# Protect the /feedbacks route with JWT
@app.route('/feedbacks', methods=['GET'])
@jwt_required()
def get_feedbacks():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM feedback")
        results = cursor.fetchall()
        cursor.close()

        # Format results into a list of dictionaries
        feedbacks = [{'id': row[0], 'name': row[1], 'email': row[2], 'message': row[3], 'created_at': row[4]} for row in results]

        return jsonify(feedbacks), 200  # Return 200 OK status
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return 500 Internal Server Error if something goes wrong

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)
