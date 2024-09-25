export default class HomePage {
  constructor(page) {
    this.page = page;
    this.logoutBtn = page.locator('[id="logout2"]');
    this.itemToAddToCartLink = page.locator(`a:text("Samsung galaxy s6")`);
    this.navBarCartBtn = page.locator("#cartur");
    this.categoriesList = page.locator(".list-group-item");
    this.laptopsCategoryBtn = page.locator(
      `.list-group-item:has-text("Laptops")`
    );
  }

  goToLaptopsCategory = async () => {
    await this.categoriesList.first().waitFor();
    await this.laptopsCategoryBtn.click();
  };
}
