import { test, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";
import ActionUtils from "../Utils/ActionUtils";

test("Check at least 1 laptop product is listed", async () => {
  let browser;
  let context;
  let page;
  let actionUtils;

  try {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    actionUtils = new ActionUtils(page);

    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const laptopsPage = poManager.getLaptopsPage();

    await test.step("Navigate to home page", async () => {
      await page.goto(dataSet.url);
      await page.waitForLoadState("load");
    });

    await test.step("Click on the laptops category", async () => {
      await actionUtils.waitForElement(homePage.categoriesList.first());
      await actionUtils.click(homePage.laptopsCategoryBtn);
    });

    await test.step("Check for available laptops", async () => {
      await actionUtils.waitForElement(laptopsPage.laptopCard.first());
      const laptopsCount = await laptopsPage.laptopCard.count();
      expect(laptopsCount).toBeGreaterThan(0, {
        message: "Expected at least one laptop product to be listed",
      });

      const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
      const laptopPrice = await laptopsPage.laptopPrice.first().textContent();

      await expect(laptopsPage.laptopTitle.first()).toBeVisible();
      expect(laptopTitle).toBeTruthy();
      expect(laptopPrice).toBeTruthy();
    });
  } catch (error) {
    console.error("Test 'Check at least 1 laptop product is listed' failed:", error);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing the browser:", closeError);
      }
    }
  }
});
