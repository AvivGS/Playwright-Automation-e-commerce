# alfabet_automation

Go to this url: https://github.com/AvivGS/alfabet_automation

Once you're on the main page of the repository, look for the green "Code" button.
Click on it, and you'll see options for HTTPS, SSH, or GitHub CLI. Choose your preferred method (HTTPS is commonly used).

Using terminal, navigate to your desired directory:
  cd path/to/your/directory
  
Clone the repository to your desired directory
  git clone https://github.com/<your-username>/alfabet_automation.git
    OR
  Open it by Github Desktop
  
Navigate to the Cloned Repository:
  cd alfabet_automation
  
Install Dependencies
  npm install
  
Install Browsers
  npx playwright install
  
 Run the Tests:
  npx playwright test
    OR
  npx playwright test --headed // To see the runs in headed mode
    OR
  Run & Generate HTML Reports:
    npx playwright test --reporter=html // Run the tests
    npx playwright show-report // Generate the HTML report
    
Alternative way is to open the project with VS Code & Run the scripts from the package.json file
