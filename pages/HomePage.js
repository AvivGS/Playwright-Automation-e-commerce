export default class HomePage {
  constructor(page) {
    this.page = page;
    this.logoutBtn = page.locator('[id="logout2"]');
    this.navBarCartBtn = page.locator("#cartur");
    this.navBarHomeBtn = page.locator(`.nav-link:has-text("Home ")`);
    this.categoriesList = page.locator(".list-group-item");
    this.laptopsCategoryBtn = page.locator(
      `.list-group-item:has-text("Laptops")`
    );
  }

  goToLaptopsCategory = async () => {
    await this.categoriesList.first().waitFor();
    await this.laptopsCategoryBtn.click();
  };

  goToProductPage = async (productToAdd) => {
    const productToAddToCartLink = this.page.locator(
      `a:text("${productToAdd}")`
    );
    await productToAddToCartLink.click();
  };

  goToCartPage = async () => {
    await this.navBarCartBtn.click();
  };

  goToHomePage = async () => {
    await this.navBarHomeBtn.click();
  };
}
