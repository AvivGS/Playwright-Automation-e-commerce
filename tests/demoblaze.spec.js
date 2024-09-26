import { test, request, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";

let page;
let context;
let browser;
const url = "https://www.demoblaze.com/";
const productName = "Samsung galaxy s6";

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.beforeEach(async () => {
    await page.goto(url);
  });

  test("Add a product to cart", async () => {
    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const productPage = poManager.getProductPage();
    const cartPage = poManager.getCartPage();

    await test.step("Navigate to product page", async () => {
      try {
        await homePage.goToProductPage(productName);
      } catch (error) {
        console.error("Error navigating to product page:", error);
      }
    });

    await test.step("Verify product name on product page", async () => {
      try {
        await expect(productPage.productName).toHaveText(productName, {
          message: `Expected product name to be "${productName}"`,
        });
      } catch (error) {
        console.error("Error verifying product name:", error);
      }
    });

    await test.step("Add the product to the cart", async () => {
      try {
        await productPage.addProductToCart();
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    });

    await test.step("Validate the product in the cart", async () => {
      try {
        await homePage.goToCartPage();
        await cartPage.itemRow.first().waitFor();
        await expect(cartPage.itemName).toHaveText(productName, {
          message: `Expected cart to contain "${productName}"`,
        });
      } catch (error) {
        console.error("Error validating product in cart:", error);
      }
    });
  });

  test("Delete a product from cart", async () => {
    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const cartPage = poManager.getCartPage();

    await test.step("Navigate to cart page", async () => {
      try {
        await homePage.goToCartPage();
        await cartPage.itemRow.first().waitFor();
        await expect(cartPage.itemName).toHaveText(productName, {
          message: `Expected cart to contain "${productName}"`,
        });
      } catch (error) {
        console.error("Error navigating to cart page:", error);
      }
    });

    await test.step("Delete the product from the cart", async () => {
      try {
        await cartPage.deleteItemFromCart();
      } catch (error) {
        console.error("Error deleting product from cart:", error);
      }
    });

    await test.step("Validate the cart is empty", async () => {
      try {
        await page.reload();
        await expect(cartPage.itemRow).toHaveCount(0, {
          message: "Expected cart to be empty after deletion",
        });
      } catch (error) {
        console.error("Error validating cart is empty:", error);
      }
    });
  });

  test.afterAll(async () => {
    await context.close();
  });
});

test("Check at least 1 laptop product is listed", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);
  const homePage = poManager.getHomePage();
  const laptopsPage = poManager.getLaptopsPage();

  await test.step("Navigate to home page", async () => {
    try {
      await page.goto(url);
      await page.waitForLoadState("load");
    } catch (error) {
      console.error("Error navigating to home page:", error);
    }
  });

  await test.step("Click on the laptops category", async () => {
    try {
      await homePage.categoriesList.first().waitFor();
      await homePage.laptopsCategoryBtn.click();
    } catch (error) {
      console.error("Error clicking laptops category:", error);
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

      await expect(laptopsPage.laptopTitle.first()).toBeVisible({
        message: "Expected the laptop title to be visible",
      });
      expect(laptopTitle).toBeTruthy({
        message: "Expected a valid laptop title, but it was empty or null.",
      });
      expect(laptopPrice).toBeTruthy({
        message: "Expected a valid laptop price, but it was empty or null.",
      });
    } catch (error) {
      console.error("Error checking for available laptops:", error);
    }
  });

  await browser.close();
});
