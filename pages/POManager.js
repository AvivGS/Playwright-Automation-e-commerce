import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import LaptopsPage from "../pages/LaptopsPage";

export default class POManager {
    constructor(page) {
      this.page = page;
      this.homePage = new HomePage(page);
      this.productPage = new ProductPage(page)
      this.cartPage = new CartPage(page);
      this.laptopsPage = new LaptopsPage(page);
    }

    getHomePage(){
        return this.homePage
    }
    getProductPage(){
        return this.productPage
    }
    getCartPage(){
        return this.cartPage
    }
    getLaptopsPage(){
        return this.laptopsPage
    }
}