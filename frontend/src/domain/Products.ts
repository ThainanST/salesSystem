export default class Products {
    constructor(readonly idProduct: number, readonly description: string, readonly price: number) {
        this.idProduct = idProduct;
        this.description = description;
        this.price = price;
    }
}