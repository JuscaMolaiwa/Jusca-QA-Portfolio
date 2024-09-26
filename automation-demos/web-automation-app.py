from asyncio import sleep
import os
from flask import Flask, jsonify  # type: ignore
from selenium import webdriver  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore
from flask_cors import CORS  # type: ignore
from selenium.webdriver.chrome.service import Service  # type: ignore
from webdriver_manager.chrome import ChromeDriverManager  # type: ignore
from webdriver_manager.firefox import GeckoDriverManager # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore
from selenium.webdriver.firefox.options import Options # type: ignore
from selenium.webdriver import FirefoxOptions # type: ignore
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities # type: ignore

from page_objects.login_page import LoginPage
from utilities.report_util import setup_logging
from utilities.video_util import start_video_recording, stop_video_recording



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run-test', methods=['POST'])
def run_test():
    driver = None
    result = "Test did not run" 
  
    try:
        # Set up WebDriver (you can choose between Chrome and Firefox)
        # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        options = FirefoxOptions()
        options.add_argument("--headless")  # type: ignore # Enable headless mode
        driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)
        
        driver.maximize_window()
        driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
        
        print(driver.title)  # Print the title of the page

        # Create an instance of the LoginPage
        login_page = LoginPage(driver)
        
        ## Perform login actions
        login_page.enter_username("Admin")
        login_page.enter_password("admin123")
        login_page.click_login()
        
        # Create screenshots directory if it doesn't exist
        if not os.path.exists('screenshots'):
            os.makedirs('screenshots')
        # Check if login was successful
        if login_page.is_login_successful():
            result = "Login successful✅🎉!"
            print("Taking screenshot for successful login...")
            try:
                sleep(7)
                driver.save_screenshot("screenshots/login_test.png")
            except Exception as e:
                    print(f"Failed to save screenshot: {e}")
        else:
            result = "Login failed❌"
            print("Taking screenshot for failed login...")
            try:
                driver.save_screenshot("screenshots/login_failed.png")
            except Exception as e:
                print(f"Failed to save screenshot: {e}")

    except Exception as e:
        result = f"Error occurred: {str(e)}"
        print(result)
    
    finally:
        # Ensure driver quits if it was created
        if driver:
            driver.quit()  

    # Return JSON response with result, screenshot, and video paths
    return jsonify({
        'result': result
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

