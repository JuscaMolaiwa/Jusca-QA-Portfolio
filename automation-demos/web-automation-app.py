from flask import Flask, jsonify  # type: ignore
from selenium import webdriver  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore
from flask_cors import CORS  # type: ignore
from selenium.webdriver.chrome.service import Service  # type: ignore
from webdriver_manager.chrome import ChromeDriverManager  # type: ignore
from webdriver_manager.firefox import GeckoDriverManager # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore

from login_page import LoginPage

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run-test', methods=['POST'])
def run_test():
    driver = None
    result = "Test did not run" 
    try:
        # Set up WebDriver (you can choose between Chrome and Firefox)
        # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
        
        driver.maximize_window()
        driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
        
        print(driver.title)  # Print the title of the page

        # Create an instance of the LoginPage
        login_page = LoginPage(driver)
        
        ## Perform login actions
        login_page.enter_username("Admin")
        login_page.enter_password("admin123")
        login_page.click_login()
        
        # Check if login was successful
        if login_page.is_login_successful():
            result = "Login successful✅🎉!"
        else:
            result = "Login failed❌"

    except Exception as e:
        result = f"Error occurred: {str(e)}"
        print(result)
    
    finally:
        if driver:
            driver.quit()  # Ensure driver quits if it was created

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

