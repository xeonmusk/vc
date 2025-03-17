try:
    from login_automation import LoginAutomation
    from test_config import TEST_USERS, BASE_URL, HEADLESS_MODE, WAIT_TIMEOUT
except ImportError as e:
    print("Error importing required modules:")
    print("1. Make sure you're in the correct directory")
    print("2. Install required packages: pip install selenium webdriver-manager")
    exit(1)

import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
import tensorflow as tf
import logging

from error_handler import retry_on_failure, handle_selenium_error, AutomationError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def verify_environment():
    try:
        from selenium import webdriver
        print("Selenium is installed correctly")
        return True
    except ImportError:
        print("Selenium is not installed. Please run: pip install selenium")
        return False

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--start-maximized')
    if HEADLESS_MODE:
        options.add_argument('--headless')
    return webdriver.Chrome(options=options)

@retry_on_failure(retries=3)
def wait_for_element(driver, by, value, timeout=10):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return element
    except TimeoutException as e:
        logger.error(f"Element not found: {value}")
        logger.error(handle_selenium_error(e))
        raise

def login_test(username, password):
    driver = None
    try:
        driver = setup_driver()
        logger.info(f"Starting login test for {username}")
        
        try:
            # Navigate to login page
            driver.get(BASE_URL)
            
            # Wait for and interact with elements
            for element_info in [
                ("username", username, "username"),
                ("password", password, "password"),
                ("login button", None, "login-button")
            ]:
                desc, value, element_id = element_info
                element = wait_for_element(driver, By.ID, element_id)
                if value:
                    element.send_keys(value)
                else:
                    element.click()
                
            # Verify login
            success = wait_for_element(driver, By.CLASS_NAME, "login-success")
            return bool(success)
            
        except AutomationError as e:
            logger.error(f"Automation error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return False
            
    finally:
        if driver:
            driver.quit()

def setup_tensorflow():
    # Configure TensorFlow to use static-sized tensors
    physical_devices = tf.config.list_physical_devices('CPU')
    if physical_devices:
        tf.config.experimental.set_memory_growth(physical_devices[0], True)

def run_tests():
    print("Starting automated tests...")
    
    for user in TEST_USERS:
        result = login_test(user["username"], user["password"])
        print(f"Login test for {user['username']}: {'PASS' if result else 'FAIL'}")

if __name__ == "__main__":
    if not verify_environment():
        sys.exit(1)
    
    run_tests()
