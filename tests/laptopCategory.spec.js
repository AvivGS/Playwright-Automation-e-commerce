import { test, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";

test("Check at least 1 laptop product is listed", async () => {
  let browser;
  let context;
  let page;

  try {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const laptopsPage = poManager.getLaptopsPage();

    await test.step("Navigate to home page", async () => {
      try {
        await page.goto(dataSet.url);
        await page.waitForLoadState("load");
      } catch (error) {
        console.error("Error navigating to home page:", error);
        throw error;
      }
    });

    await test.step("Click on the laptops category", async () => {
      try {
        await homePage.categoriesList.first().waitFor();
        await homePage.laptopsCategoryBtn.click();
      } catch (error) {
        console.error("Error clicking on laptops category:", error);
        throw error;
      }
    });

    await test.step("Check for available laptops", async () => {
      try {
        await laptopsPage.laptopCard.first().waitFor();
        const laptopsCount = await laptopsPage.laptopCard.count();
        expect(laptopsCount).toBeGreaterThan(0, {
          message: "Expected at least one laptop product to be listed",
        });

        const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
        const laptopPrice = await laptopsPage.laptopPrice.first().textContent();

        await expect(laptopsPage.laptopTitle.first()).toBeVisible();
        expect(laptopTitle).toBeTruthy();
        expect(laptopPrice).toBeTruthy();
      } catch (error) {
        console.error("Error checking for available laptops:", error);
        throw error;
      }
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
