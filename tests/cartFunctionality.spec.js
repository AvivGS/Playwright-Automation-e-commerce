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
const url = "https://www.demoblaze.com/";
const productName = "Samsung galaxy s6";
const addToCartUrl = "https://api.demoblaze.com/addtocart";
let requestCaptured = false;

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.beforeEach(async () => {
    await page.goto(dataSet.url);
  });

  // Add tests to skip on Firefox
  test("Add a product to cart", async ({ browserName }) => {
    // Skip the test on Firefox
    if (browserName === "firefox") {
      test.skip("Skipping add product to cart test on Firefox");
    }

    page.on("request", (request) => {
      if (request.url().includes(addToCartUrl) && request.method() === "POST") {
        console.log("Add to cart request was sent!");
        requestCaptured = true;
      }
    });
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
      expect(requestCaptured).toBe(
        true,
        "Expected the 'Add to Cart' request to be sent."
      );
    });

    await test.step("Validate the product in the cart", async () => {
      await homePage.goToCartPage();
      await cartPage.itemRow.first().waitFor(); // Ensure at least one item is visible
      await expect(cartPage.itemName).toHaveText(dataSet.productName);
    });
  });

  // Skip this test on Firefox
  test("Delete a product from cart", async ({ browserName }) => {
    if (browserName === "firefox") {
      test.skip("Skipping delete product from cart test on Firefox");
    }

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
      await page.reload();
      await expect(cartPage.itemRow).toHaveCount(0);
    });
  });

  test.afterAll(async () => {
    await context.close();
  });
});
