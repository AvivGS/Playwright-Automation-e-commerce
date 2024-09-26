import { test, chromium, expect } from "@playwright/test";
import POManager from "../pages/POManager";
import dataSet from "../Utils/data.json";

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
