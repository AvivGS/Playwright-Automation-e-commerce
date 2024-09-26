const productToAdd = "Samsung galaxy s6";

export default class HomePage {
  constructor(page) {
    this.page = page;
    this.logoutBtn = page.locator('[id="logout2"]');
    this.itemToAddToCartLink = page.locator(`a:text("${productToAdd}")`);
    this.navBarCartBtn = page.locator("#cartur");
    this.categoriesList = page.locator('.list-group-item')
    this.laptopsCategoryBtn = page.locator(`.list-group-item:has-text("Laptops")`)
  }

  goToLaptopsCategory = async () => {
    await this.categoriesList.first().waitFor();
    await this.laptopsCategoryBtn.click();
  };

  goToProductPage = async () => {
    await this.itemToAddToCartLink.click();
  };

  goToCartPage = async () => {
    await this.navBarCartBtn.click();
  };
}
