import { test, request, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";

let page;
let context;
let browser;
const url = "https://www.demoblaze.com/";
const productName = "Samsung galaxy s6";
const errors = [];
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

const handlePageErrors = (error) => {
  errors.push(error.message);
};

test.describe("Cart functionality with shared state", () => {
  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();

    page.on("pageerror", handlePageErrors);
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
      await homePage.goToProductPage(productName);
    });

    await test.step("Verify product name on product page", async () => {
      await expect(productPage.productName).toHaveText(productName);
    });

    await test.step("Add the product to the cart", async () => {
      await productPage.addProductToCart();
    });

    await test.step("Validate the product in the cart", async () => {
      await homePage.goToCartPage();
      await cartPage.itemRow.first().waitFor(); // Ensure at least one item is visible
      await expect(cartPage.itemName).toHaveText(productName);
    });
  });

  test("Delete a product from cart", async () => {
    const poManager = new POManager(page);
    const homePage = poManager.getHomePage();
    const cartPage = poManager.getCartPage();

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCartPage();
      await cartPage.itemRow.first().waitFor(); // Ensure at least one item is visible
      await expect(cartPage.itemName).toHaveText(productName);
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

test("Check at least 1 laptop product is listed", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);
  const homePage = poManager.getHomePage();
  const laptopsPage = poManager.getLaptopsPage();

  /* 
  // Set the cookie with the token
  // await context.addCookies([
  //   {
  //     name: cookieTokenName,
  //     value: cookieTokenValue,
  //     domain: ".demoblaze.com",
  //     path: "/",
  //     httpOnly: false,
  //     secure: true,
  //   },
  // ]);
  */

  await test.step("Navigate to home page", async () => {
    await page.goto(url);
    await page.waitForLoadState("load");
  });

  await test.step("Click on the laptops category", async () => {
    await homePage.categoriesList.first().waitFor(); // Ensure categories are visible
    await homePage.laptopsCategoryBtn.click();
  });

  await test.step("Check for available laptops", async () => {
    await laptopsPage.laptopCard.first().waitFor(); // Ensure at least one laptop is visible
    const laptopsCount = await laptopsPage.laptopCard.count(); // Get count of laptop cards
    expect(laptopsCount).toBeGreaterThan(0); // Ensure there is at least one laptop

    const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
    const laptopPrice = await laptopsPage.laptopPrice.first().textContent();

    await expect(laptopsPage.laptopTitle.first()).toBeVisible(); // Ensure the title is visible
    expect(laptopTitle).toBeTruthy();
    expect(laptopPrice).toBeTruthy();
  });

  await browser.close();
});

test.afterAll(() => {
  if (errors.length > 0) {
    console.error("Errors encountered during tests:", errors);
  }
});
