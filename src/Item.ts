export default class Item {

    constructor (
        readonly idProduct: number,
        readonly price: number,
        readonly quantity: number
    ) {
        if (quantity <= 0) throw new Error('Quantity must be positive');
    }

    getTotal() {
        return this.price * this.quantity;
    }
}