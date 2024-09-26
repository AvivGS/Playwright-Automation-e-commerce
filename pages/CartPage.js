export default class CartPage {
  constructor(page) {
    this.page = page;
    this.itemRow = page.locator(".success");
    this.itemName = this.itemRow.locator(`td:has-text("Samsung galaxy s6")`);
    this.deleteItemBtn = this.itemRow.locator('td a:has-text("Delete")');
  }

  deleteItemFromCart = async () => {
    await this.deleteItemBtn.waitFor();
    await this.deleteItemBtn.click();
  };
}
