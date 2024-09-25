export default class LaptopsPage {
  constructor(page) {
    this.page = page;
    this.laptopCard = page.locator(".card");
    this.laptopTitle = this.laptopCard.locator("h4.card-title a");
    this.laptopPrice = this.laptopCard.locator("h5");
  }
  getLaptopsCount = async () => {
    await this.laptopCard.first().waitFor();
    const laptopsCount = await this.laptopCard.count();
    return laptopsCount;
  };

  getFirstLaptopTitle = async () => {
    await this.laptopTitle.first().isVisible();
    const firstLaptopTitle = await this.laptopTitle.first().textContent();
    return firstLaptopTitle;
  };
  getFirstLaptopPrice = async () => {
    await this.laptopPrice.first().isVisible();
    const firsstLaptopPrice = await this.laptopPrice.first().textContent();
    return firsstLaptopPrice;
  };
}
