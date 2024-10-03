from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class OrderPage:
    def __init__(self, driver):
        self.driver = driver
        self.add_to_cart_button = (By.ID, "add-to-cart-sauce-labs-backpack")  # Example product
        self.cart_link = (By.CLASS_NAME, "shopping_cart_link")
        self.checkout_button = (By.ID, "checkout")
        self.first_name_field = (By.ID, "first-name")
        self.last_name_field = (By.ID, "last-name")
        self.postal_code_field = (By.ID, "postal-code")
        self.continue_button = (By.ID, "continue")
        self.finish_button = (By.ID, "finish")
        self.order_confirmation = (By.XPATH, "//h2[@class='complete-header'][contains(.,'Thank you for your order!')]")

    def add_product_to_cart(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.add_to_cart_button)
        ).click()

    def go_to_cart(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.cart_link)
        ).click()

    def proceed_to_checkout(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.checkout_button)
        ).click()

    def enter_checkout_information(self, first_name, last_name, postal_code):
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(self.first_name_field)
        ).send_keys(first_name)
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(self.last_name_field)
        ).send_keys(last_name)
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located(self.postal_code_field)
        ).send_keys(postal_code)

    def click_continue(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.continue_button)
        ).click()

    def complete_order(self):
        WebDriverWait(self.driver, 15).until(
            EC.element_to_be_clickable(self.finish_button)
        ).click()

    def is_order_successful(self):
        try:
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located(self.order_confirmation)
            )
            return True
        except Exception:
            return False

    # Reusable method to place an order
    def place_order(self, first_name, last_name, postal_code):
        self.add_product_to_cart()
        self.go_to_cart()
        self.proceed_to_checkout()
        self.enter_checkout_information(first_name, last_name, postal_code)
        self.click_continue()
        self.complete_order()
        return self.is_order_successful()
