export default class LaptopsPage {
  constructor(page) {
    this.page = page;
    this.laptopCard = page.locator(".card");
    this.laptopTitle = this.laptopCard.locator("h4.card-title a");
    this.laptopPrice = this.laptopCard.locator("h5");
  }
}
