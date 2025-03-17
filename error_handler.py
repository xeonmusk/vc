from selenium.common.exceptions import TimeoutException, WebDriverException
import logging
from functools import wraps
import time

class AutomationError(Exception):
    pass

def retry_on_failure(retries=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == retries - 1:
                        raise AutomationError(f"Failed after {retries} attempts: {str(e)}")
                    logging.warning(f"Attempt {attempt + 1} failed, retrying...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

def handle_selenium_error(error):
    error_map = {
        TimeoutException: "Element not found or timeout occurred",
        WebDriverException: "WebDriver operation failed",
    }
    error_type = type(error)
    return error_map.get(error_type, str(error))
