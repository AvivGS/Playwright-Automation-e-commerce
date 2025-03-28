import { test, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";
import ActionUtils from "../Utils/ActionUtils";
import NetworkUtils from "../Utils/NetworkUtils";

let page;
let context;
let browser;
let actionUtils;
let networkUtils;

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    try {
      browser = testBrowser;
      context = await browser.newContext();
      page = await context.newPage();
      actionUtils = new ActionUtils(page);
      networkUtils = new NetworkUtils(page);
    } catch (error) {
      console.error("Error during setup in beforeAll:", error);
      throw error;
    }
  });

  test.beforeEach(async () => {
    try {
      await page.goto(dataSet.url);
    } catch (error) {
      console.error("Error navigating to URL:", error);
      throw error;
    }
  });

  test("Add a product to cart", async ({ browserName }) => {
    if (browserName === "firefox") {
      test.skip("Skipping add product to cart test on Firefox");
    }

    try {
      networkUtils.captureRequest(dataSet.addToCartUrl, "POST");

      const poManager = new POManager(page);
      const homePage = poManager.getHomePage();
      const productPage = poManager.getProductPage();
      const cartPage = poManager.getCartPage();

      await test.step("Navigate to product page", async () => {
        await homePage.goToProductPage(dataSet.productName);
      });

      await test.step("Verify product name on product page", async () => {
        await expect(productPage.productName).toHaveText(dataSet.productName, {
          message: `Expected product name to be "${dataSet.productName}"`,
        });
      });

      await test.step("Add the product to the cart", async () => {
        await productPage.addProductToCart();
        const requestCaptured = networkUtils.verifyRequestCaptured(
          dataSet.addToCartUrl
        );
        expect(requestCaptured).toBe(
          true,
          "Expected 'Add to Cart' request to be captured."
        );
      });

      await test.step("Validate the product in the cart", async () => {
        await homePage.goToCartPage();
        await actionUtils.waitForElement(cartPage.itemRow.first());
        await expect(cartPage.itemName).toHaveText(dataSet.productName, {
          message: `Expected cart to contain "${dataSet.productName}"`,
        });
      });
    } catch (error) {
      console.error("Test 'Add a product to cart' failed:", error);
      throw error;
    }
  });

  test("Delete a product from cart", async ({ browserName }) => {
    if (browserName === "firefox") {
      test.skip("Skipping delete product from cart test on Firefox");
    }

    try {
      const poManager = new POManager(page);
      const homePage = poManager.getHomePage();
      const cartPage = poManager.getCartPage();

      await test.step("Navigate to cart page", async () => {
        await homePage.goToCartPage();
        await actionUtils.waitForElement(cartPage.itemRow.first());
        await expect(cartPage.itemName).toHaveText(dataSet.productName, {
          message: `Expected cart to contain "${dataSet.productName}"`,
        });
      });

      await test.step("Delete the product from the cart", async () => {
        await cartPage.deleteItemFromCart();
      });

      await test.step("Validate the cart is empty", async () => {
        await page.reload();
        await expect(cartPage.itemRow).toHaveCount(0, {
          message: "Expected cart to be empty after deletion",
        });
      });
    } catch (error) {
      console.error("Test 'Delete a product from cart' failed:", error);
      throw error;
    }
  });

  test.afterAll(async () => {
    try {
      await context.close();
    } catch (error) {
      console.error("Error during teardown in afterAll:", error);
    }
  });
});
