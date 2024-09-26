import { test, request, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";

const url = "https://www.demoblaze.com/";
const loginUrl = "https://api.demoblaze.com/login";

const loginPayload = {
  username: "aviv_alfabet",
  password: "YXZpdl9hbGZhYmV0MSE=",
};

const cookieTokenName = "tokenp_";
let cookieTokenValue = "";
// const itemToAddToCart = "Samsung galaxy s6";

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(loginUrl, { data: loginPayload });
  await expect(loginResponse).toBeOK();
  const loginResponseJson = await loginResponse.json();
  cookieTokenValue = loginResponseJson
    .slice(loginResponseJson.indexOf(":") + 1)
    .trim(); // Extracts the part after the colon
});

test("Add a product to cart", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);

  const homePage = poManager.getHomePage();
  const productPage = poManager.getProductPage();
  const cartPage = poManager.getCartPage();

  // Set the cookie with the token
  await context.addCookies([
    {
      name: cookieTokenName,
      value: cookieTokenValue,
      domain: ".demoblaze.com",
      path: "/",
      httpOnly: false,
      secure: true,
    },
  ]);
  await page.goto(url);
  await page.waitForLoadState("load");

  await homePage.logoutBtn.waitFor();

  // Add product to cart
  await homePage.goToProductPage();
  await expect(productPage.productName).toHaveText("Samsung galaxy s6");
  await productPage.addProductToCart();

  // Validate the product in the cart
  await homePage.goToCartPage();
  await cartPage.itemRow.first().waitFor();
  await expect(cartPage.itemName).toHaveText("Samsung galaxy s6");

  await browser.close();
});

test("Delete a product from cart", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);

  const homePage = poManager.getHomePage();
  const cartPage = poManager.getCartPage();

  // Set the cookie with the token
  await context.addCookies([
    {
      name: cookieTokenName,
      value: cookieTokenValue,
      domain: ".demoblaze.com",
      path: "/",
      httpOnly: false,
      secure: true,
    },
  ]);
  await page.goto(url);
  await page.waitForLoadState("load");

  await homePage.logoutBtn.waitFor();

  // Validate the product in the cart
  await homePage.goToCartPage();
  await cartPage.itemRow.first().waitFor();
  await expect(cartPage.itemName).toHaveText("Samsung galaxy s6");

  await cartPage.deleteItemFromCart();

  await page.reload();
  expect(async () => {
    await expect(cartPage.deleteItemBtn).not.toBeVisible();
  }).toPass();
  await browser.close();
});

test("Check at least 1 laptop product is listed ", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);

  const homePage = poManager.getHomePage();
  const laptopsPage = poManager.getLaptopsPage();

  // Set the cookie with the token
  await context.addCookies([
    {
      name: cookieTokenName,
      value: cookieTokenValue,
      domain: ".demoblaze.com",
      path: "/",
      httpOnly: false,
      secure: true,
    },
  ]);
  await page.goto(url);
  await page.waitForLoadState("load");

  await homePage.logoutBtn.waitFor();
  await homePage.categoriesList.first().waitFor();
  await homePage.laptopsCategoryBtn.click();
  await laptopsPage.laptopCard.first().waitFor();
  const laptopsCount = await laptopsPage.laptopCard.count();
  expect(laptopsCount).toBeGreaterThan(0);
  await laptopsPage.laptopTitle.first().isVisible();
  const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
  const laptopPrice = await laptopsPage.laptopPrice.first().textContent();
  expect(laptopTitle).toBeTruthy();
  expect(laptopPrice).toBeTruthy();

  await browser.close();
});
