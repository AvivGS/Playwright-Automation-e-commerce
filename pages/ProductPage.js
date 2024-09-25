export default class ProductPage{
    constructor(page){
        this.page = page
        this.productName = page.locator("#tbodyid .name");
        this.addToCartBtn = page.locator(".btn-success");
    }
}