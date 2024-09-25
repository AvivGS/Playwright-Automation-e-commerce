import { test, request, chromium, expect } from "@playwright/test";

const url = "https://www.demoblaze.com/";
const loginUrl = "https://api.demoblaze.com/login";

const loginPayload = {
  username: "aviv_alfabet",
  password: "YXZpdl9hbGZhYmV0MSE=",
};

const cookieTokenName = "tokenp_";
let cookieTokenValue = "";
const itemToAddToCart = "Samsung galaxy s6";

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(loginUrl, { data: loginPayload });
  await expect(loginResponse).toBeOK();
  const loginResponseJson = await loginResponse.json();
  cookieTokenValue = loginResponseJson.slice(loginResponseJson.indexOf(":") + 1).trim(); // Extracts the part after the colon
});

test("Add a product to cart", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

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

  // Wait for the logout button to appear
  const logoutBtn = page.locator('[id="logout2"]');
  await logoutBtn.waitFor();

  const itemToAddToCartLink = page.locator(`a:text("${itemToAddToCart}")`);
  await itemToAddToCartLink.click(); // Example: click the link
  const productName = page.locator("#tbodyid .name");
  expect(productName).toHaveText(itemToAddToCart);
  const addToCartBtn = page.locator(".btn-success");
  await addToCartBtn.click();
  page.on("dialog", (dialog) => dialog.accept());

  // Validate the product in the cart
  const navBarCartBtn = page.locator("#cartur");
  await navBarCartBtn.click();
  await page.locator(".success").first().waitFor();
  const tdElementOfItem = page.locator(
    `tr.success td:has-text("${itemToAddToCart}")`
  );
  await expect(tdElementOfItem).toHaveText(itemToAddToCart);

  await browser.close();
});

test("Delete a product from cart", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

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

  // Wait for the logout button to appear
  const logoutBtn = page.locator('[id="logout2"]');
  await logoutBtn.waitFor();

  // Validate the product in the cart
  const navBarCartBtn = page.locator("#cartur");
  await navBarCartBtn.click();
  await page.locator(".success").first().waitFor();
  const tdElementOfItem = page.locator(`tr.success td:has-text("${itemToAddToCart}")`);
  await expect(tdElementOfItem).toHaveText(itemToAddToCart);
  await page.locator(`tr.success td:has-text("Delete")`).waitFor();
  const tdDeleteItem = page.locator(`tr.success td a:has-text("Delete")`);

  await tdDeleteItem.click();
  await page.reload();
  expect(async () => {
    await expect(tdDeleteItem).not.toBeVisible();
  }).toPass();
  await browser.close();
});

test("Check at least 1 laptop product is listed ", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

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

  // Wait for the logout button to appear
  const logoutBtn = page.locator('[id="logout2"]');
  await logoutBtn.waitFor();
  await page.locator('[class="list-group-item"]').first().waitFor();
  const laptopsTabBtn = page.locator(`.list-group-item:has-text("Laptops")`);
  await laptopsTabBtn.click();
  await page.locator(".card").first().waitFor();
  const itemsCount = await page.locator(".card").count();
  expect(itemsCount).toBeGreaterThan(0);
  await page.locator(".card").first().locator("h4.card-title a").isVisible();
  const laptopTitle = await page.locator(".card").first().locator("h4.card-title a").textContent();
  const laptopPrice = await page.locator(".card").first().locator("h5").textContent();
  expect(laptopTitle).toBeTruthy();
  expect(laptopPrice).toBeTruthy();

  await browser.close();
});
