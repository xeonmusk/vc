try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.options import Options
except ImportError:
    print("Required packages not found. Please run:")
    print("pip install selenium webdriver-manager")
    exit(1)

from base_test import BaseTest
from test_config import BASE_URL, TEST_USERS

class LoginAutomation(BaseTest):
    def __init__(self, driver=None, base_url="http://localhost:3000", timeout=10):
        super().__init__(driver)
        self.base_url = base_url
        self.timeout = timeout
        self.wait = WebDriverWait(self.driver, self.timeout)

    def setup_driver(self):
        try:
            chrome_options = Options()
            if self.headless:
                chrome_options.add_argument('--headless')
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.implicitly_wait(10)
        except Exception as e:
            print(f"Failed to setup Chrome driver: {str(e)}")
            raise

    def verify_elements(self):
        """Verify presence of all main elements on the page"""
        try:
            # Updated selectors for React components
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((
                    By.CSS_SELECTOR, "[data-testid='login-form'], [data-testid='register-link']"
                ))
            )
            return True
        except Exception as e:
            print(f"Error verifying elements: {str(e)}")
            return False

    def login(self, username, password):
        try:
            # Navigate to login page
            self.driver.get(f"{self.base_url}/login")
            
            # Find and fill username
            username_field = self.wait.until(
                EC.presence_of_element_located((By.NAME, "username"))
            )
            username_field.send_keys(username)
            
            # Find and fill password
            password_field = self.wait.until(
                EC.presence_of_element_located((By.NAME, "password"))
            )
            password_field.send_keys(password)
            
            # Click login button
            login_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
            )
            login_button.click()
            
            # Wait for successful login
            self.wait.until(lambda driver: driver.current_url != f"{self.base_url}/login")
            print(f"Successfully logged in as {username}")
            
        except Exception as e:
            print(f"Login failed: {str(e)}")
            raise

    def test_login(self, username, password):
        try:
            self.login(username, password)
            return self.verify_login_success()
        except Exception as e:
            print(f"Error during login test: {str(e)}")
            return False

    def register(self, username, password):
        try:
            self.setup_driver()
            self.driver.get(self.url)
            
            # Click register link/button
            register_link = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//a[text()='Register']"))
            )
            register_link.click()
            
            # Fill registration form
            username_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "username"))
            )
            username_field.send_keys(username)
            
            password_field = self.driver.find_element(By.NAME, "password")
            password_field.send_keys(password)
            
            submit_button = self.driver.find_element(By.XPATH, "//button[text()='Register']")
            submit_button.click()
            
            print("Registration successful!")
            
        except Exception as e:
            print(f"Error during registration: {str(e)}")
        finally:
            if self.driver:
                self.driver.quit()

    def logout(self):
        try:
            logout_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//a[text()='Logout']"))
            )
            logout_button.click()
            print("Logout successful!")
            
        except Exception as e:
            print(f"Error during logout: {str(e)}")

    def navigate_to_products(self):
        try:
            products_link = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//a[text()='Products']"))
            )
            products_link.click()
            print("Navigated to products page!")
            
        except Exception as e:
            print(f"Error navigating to products: {str(e)}")

    def verify_login_success(self):
        try:
            # Wait for dashboard or success element
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "dashboard")))
            return True
        except:
            return False

if __name__ == "__main__":
    automation = LoginAutomation()
    try:
        automation.login("vammsi", "Password")
        if automation.verify_login_success():
            print("Login test completed successfully")
        else:
            print("Login verification failed")
    finally:
        automation.teardown()
