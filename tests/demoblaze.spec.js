import { test, request, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";

let page;
let context;
let browser;
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
    await page.goto(url);
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
      await homePage.goToProductPage(productName);
    });

    await test.step("Verify product name on product page", async () => {
      await expect(productPage.productName).toHaveText(productName);
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
      await cartPage.itemRow.first().waitFor();
      await expect(cartPage.itemName).toHaveText(productName);
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
      await cartPage.itemRow.first().waitFor();
      await expect(cartPage.itemName).toHaveText(productName);
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

test("Check at least 1 laptop product is listed", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);
  const homePage = poManager.getHomePage();
  const laptopsPage = poManager.getLaptopsPage();

  await test.step("Navigate to home page", async () => {
    await page.goto(url);
    await page.waitForLoadState("load");
  });

  await test.step("Click on the laptops category", async () => {
    await homePage.categoriesList.first().waitFor();
    await homePage.laptopsCategoryBtn.click();
  });

  await test.step("Check for available laptops", async () => {
    await laptopsPage.laptopCard.first().waitFor();
    const laptopsCount = await laptopsPage.laptopCard.count();
    expect(laptopsCount).toBeGreaterThan(0);

    const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
    const laptopPrice = await laptopsPage.laptopPrice.first().textContent();

    await expect(laptopsPage.laptopTitle.first()).toBeVisible();
    expect(laptopTitle).toBeTruthy();
    expect(laptopPrice).toBeTruthy();
  });

  await browser.close();
});
