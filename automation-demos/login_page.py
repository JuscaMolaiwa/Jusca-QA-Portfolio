from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore

class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_field = (By.NAME, "username")
        self.password_field = (By.NAME, "password")
        self.submit_button = (By.XPATH, "//button[@type='submit']")
        self.dashboard_link = (By.XPATH, "//a[@class='oxd-main-menu-item active'][contains(.,'Dashboard')]")

    def enter_username(self, username):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(self.username_field)
        ).send_keys(username)

    def enter_password(self, password):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(self.password_field)
        ).send_keys(password)

    def click_login(self):
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(self.submit_button)
        ).click()

    def is_login_successful(self):
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(self.dashboard_link)
            )
            return True
        except Exception:
            return False
