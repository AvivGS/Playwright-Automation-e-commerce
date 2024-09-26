import { test, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";

let page;
let context;
let browser;

/*
// const loginUrl = "https://api.demoblaze.com/login";

// const loginPayload = {
//   username: "aviv_alfabet",
//   password: "YXZpdl9hbGZhYmV0MSE=",
// };

// const cookieTokenName = "tokenp_";
// let cookieTokenValue = "";
*/
/*
// test.beforeAll(async () => {
// const apiContext = await request.newContext();
// const loginResponse = await apiContext.post(loginUrl, { data: loginPayload });
// await expect(loginResponse).toBeOK();
// const loginResponseJson = await loginResponse.json();
// cookieTokenValue = loginResponseJson
//   .slice(loginResponseJson.indexOf(":") + 1)
//   .trim(); // Extracts the part after the colon
// });
*/

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.beforeEach(async () => {
    await page.goto(dataSet.url);
  });

  test("Add a product to cart", async () => {
    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const productPage = poManager.getProductPage();
    const cartPage = poManager.getCartPage();

    await test.step("Navigate to product page", async () => {
      await homePage.goToProductPage(dataSet.productName);
    });

    await test.step("Verify product name on product page", async () => {
      await expect(productPage.productName).toHaveText(dataSet.productName);
    });

    await test.step("Add the product to the cart", async () => {
      await productPage.addProductToCart();
    });

    await test.step("Validate the product in the cart", async () => {
      await homePage.goToCartPage();
      await cartPage.itemRow.first().waitFor(); // Ensure at least one item is visible
      await expect(cartPage.itemName).toHaveText(dataSet.productName);
    });
  });

  test("Delete a product from cart", async () => {
    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const cartPage = poManager.getCartPage();

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCartPage();
      await cartPage.itemRow.first().waitFor(); // Ensure at least one item is visible
      await expect(cartPage.itemName).toHaveText(dataSet.productName);
    });

    await test.step("Delete the product from the cart", async () => {
      await cartPage.deleteItemFromCart();
    });

    await test.step("Validate the cart is empty", async () => {
      await page.reload(); // Reload the page to reflect the cart changes
      await expect(cartPage.itemRow).toHaveCount(0); // Check if no items are left in the cart
    });
  });

  test.afterAll(async () => {
    await context.close();
  });
});
