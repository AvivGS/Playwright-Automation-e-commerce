export default class ActionUtils {
    constructor(page) {
      this.page = page;
    }
  
    async click(locator) {
      await locator.waitFor();
      await locator.click();
    }
  
    async waitForElement(locator) {
      await locator.waitFor();
    }
  }
  