export default class Order {
    items: any[];
    code = "";
    total = 0;

    constructor(readonly cpf: string) {
        this.items = [];
    }

    addItem (product: any) {
        const existingItem = this.items.find( (item: any) => item.idProduct === product.idProduct);
        if (!existingItem) {
            this.items.push({ idProduct: product.idProduct, price: product.price, quantity: 1 });
        } else {
            existingItem.quantity++;
        }
    }

    decreaseItem (idProduct: number) {
        const index = this.items.findIndex( (item: any) => item.idProduct === idProduct);
        if (this.items[index].quantity > 1) {
            this.items[index].quantity--;
        } else {
            this.items.splice(index, 1);
        }
    }
    increaseItem (idProduct: number) {
        const index = this.items.findIndex( (item: any) => item.idProduct === idProduct);
        this.items[index].quantity++;
    }

    getTotal (): number {
        let total = 0;
        for (const item of this.items) {
            total += item.price * item.quantity;
        }
        return total;
    }

}