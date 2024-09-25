export default class CartPage {
  constructor(page) {
    this.page = page;
    this.itemRow = page.locator(".success");
    this.itemName = this.itemRow.locator(`td:has-text("Samsung galaxy s6")`); // Move text to const files
    this.deleteItemBtn = this.itemRow.locator('td a:has-text("Delete")');
  }
}
