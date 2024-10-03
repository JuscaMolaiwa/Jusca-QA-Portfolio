from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore

class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_field = (By.ID, "user-name")
        self.password_field = (By.ID, "password")
        self.submit_button = (By.ID, "login-button")
        self.dashboard_link = (By.XPATH, "//div[@class='app_logo'][contains(.,'Swag Labs')]")
        self.products_displayed = (By.XPATH, "//span[@class='title'][contains(.,'Products')]")

    def enter_username(self, username):
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(self.username_field)
        ).send_keys(username)

    def enter_password(self, password):
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(self.password_field)
        ).send_keys(password)

    def click_login(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.submit_button)
        ).click()

    def is_login_successful(self):
        try:
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located(self.dashboard_link)
            ) and WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located(self.products_displayed)
            )
            return True
        except Exception:
            return False


    # Reusable login method
    def perform_login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()
        return self.is_login_successful()
