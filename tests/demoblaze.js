import { test, request, chromium, expect } from "@playwright/test";

const url = "https://www.demoblaze.com/";
const loginUrl = "https://api.demoblaze.com/login";

const loginPayload = {
  username: "aviv_alfabet",
  password: "YXZpdl9hbGZhYmV0MSE=",
};

const cookieTokenName = "tokenp_";
let cookieTokenValue = "";

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(loginUrl, { data: loginPayload });
  await expect(loginResponse).toBeOK();
  const loginResponseJson = await loginResponse.json();
  cookieTokenValue = loginResponseJson.slice(loginResponseJson.indexOf(":") + 1).trim(); // Extracts the part after the colon
});

test("Add a product to Cart", async () => {
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

  await browser.close();
});
