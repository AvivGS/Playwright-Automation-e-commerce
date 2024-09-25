import { test, request, chromium, expect } from "@playwright/test";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import LaptopsPage from "../pages/LaptopsPage";

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

  // Extract to Utils File
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

  const homePage = new HomePage(page); // Create POManager class
  const productPage = new ProductPage(page); // Create POManager class
  const cartPage = new CartPage(page); // Create POManager class

  await homePage.logoutBtn.waitFor();

  // Add product to cart
  await homePage.itemToAddToCartLink.click();
  await expect(productPage.productName).toHaveText("Samsung galaxy s6"); // Move text to const files
  await productPage.addToCartBtn.click();
  page.on("dialog", (dialog) => dialog.accept());

  // Validate the product in the cart
  await homePage.navBarCartBtn.click();
  await cartPage.itemRow.first().waitFor();
  await expect(cartPage.itemName).toHaveText("Samsung galaxy s6"); // Move text to const files

  await browser.close();
});

test("Delete a product from cart", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);

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
  await homePage.navBarCartBtn.click();
  await cartPage.itemRow.first().waitFor();
  await expect(cartPage.itemName).toHaveText("Samsung galaxy s6"); // Move text to const files

  await cartPage.deleteItemBtn.waitFor();
  await cartPage.deleteItemBtn.click();

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

  const homePage = new HomePage(page);
  const laptopsPage = new LaptopsPage(page);

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
