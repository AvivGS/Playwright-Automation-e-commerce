import { test, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";

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

test("Check at least 1 laptop product is listed ", async () => {
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
    await page.goto(dataSet.url);
    await page.waitForLoadState("load");
  });

  await test.step("Click on the laptops category", async () => {
    await homePage.categoriesList.first().waitFor();
    await homePage.laptopsCategoryBtn.click();
  });

  await test.step("Check for available laptops", async () => {
    await laptopsPage.laptopCard.first().waitFor();
    const laptopsCount = await laptopsPage.laptopCard.count();
    expect(laptopsCount).toBeGreaterThan(0, {
      message: "Expected at least one laptop product to be listed",
    });

    const laptopTitle = await laptopsPage.laptopTitle.first().textContent();
    const laptopPrice = await laptopsPage.laptopPrice.first().textContent();

    await expect(laptopsPage.laptopTitle.first()).toBeVisible();
    expect(laptopTitle).toBeTruthy();
    expect(laptopPrice).toBeTruthy();
  });

  await browser.close();
});
