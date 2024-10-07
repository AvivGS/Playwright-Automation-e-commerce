export default class ActionUtils {
  constructor(page) {
    this.page = page;
  }

  async waitForElement(element) {
    try {
      await element.waitFor({ state: "visible" });
    } catch (error) {
      console.error("Error while waiting for element:", error);
      throw error;
    }
  }

  async click(element) {
    try {
      await element.click();
    } catch (error) {
      console.error("Error during click action:", error);
      throw error;
    }
  }
}
