import { test, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";

let page;
let context;
let browser;
let requestCaptured = false;

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    try {
      browser = testBrowser;
      context = await browser.newContext();
      page = await context.newPage();
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
      page.on("request", (request) => {
        if (
          request.url().includes(dataSet.addToCartUrl) &&
          request.method() === "POST"
        ) {
          console.log("Add to cart request was sent!");
          requestCaptured = true;
        }
      });

      const poManager = new POManager(page);
      const homePage = poManager.getHomePage();
      const productPage = poManager.getProductPage();
      const cartPage = poManager.getCartPage();

      await test.step("Navigate to product page", async () => {
        try {
          await homePage.goToProductPage(dataSet.productName);
        } catch (error) {
          console.error("Error navigating to product page:", error);
          throw error;
        }
      });

      await test.step("Verify product name on product page", async () => {
        try {
          await expect(productPage.productName).toHaveText(dataSet.productName, {
            message: `Expected product name to be "${dataSet.productName}"`,
          });
        } catch (error) {
          console.error("Error verifying product name:", error);
          throw error;
        }
      });

      await test.step("Add the product to the cart", async () => {
        try {
          await productPage.addProductToCart();
          expect(requestCaptured).toBe(
            true,
            "Expected the 'Add to Cart' request to be sent."
          );
        } catch (error) {
          console.error("Error adding product to cart:", error);
          throw error;
        }
      });

      await test.step("Validate the product in the cart", async () => {
        try {
          await homePage.goToCartPage();
          await cartPage.itemRow.first().waitFor();
          await expect(cartPage.itemName).toHaveText(dataSet.productName, {
            message: `Expected cart to contain "${dataSet.productName}"`,
          });
        } catch (error) {
          console.error("Error validating product in cart:", error);
          throw error;
        }
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
        try {
          await homePage.goToCartPage();
          await cartPage.itemRow.first().waitFor();
          await expect(cartPage.itemName).toHaveText(dataSet.productName, {
            message: `Expected cart to contain "${dataSet.productName}"`,
          });
        } catch (error) {
          console.error("Error navigating to cart page or verifying product:", error);
          throw error;
        }
      });

      await test.step("Delete the product from the cart", async () => {
        try {
          await cartPage.deleteItemFromCart();
        } catch (error) {
          console.error("Error deleting product from cart:", error);
          throw error;
        }
      });

      await test.step("Validate the cart is empty", async () => {
        try {
          await page.reload();
          await expect(cartPage.itemRow).toHaveCount(0, {
            message: "Expected cart to be empty after deletion",
          });
        } catch (error) {
          console.error("Error validating the empty cart:", error);
          throw error;
        }
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
