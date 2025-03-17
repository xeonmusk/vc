from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from test_config import CHROME_WAIT_TIME

class BaseTest:
    def __init__(self, driver=None):
        self.driver = driver
        self.headless = False

    def setup_driver(self):
        if not self.driver:
            chrome_options = Options()
            if self.headless:
                chrome_options.add_argument('--headless')
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.implicitly_wait(10)

    def teardown(self):
        if self.driver:
            self.driver.quit()
            self.driver = None
