import Coupon from "./Coupon";
import Cpf from "./Cpf";
import FreightCalculator from "./FreightCalculator";
import Item from "./Item";
import OrderCode from "./OrderCode";
import Product from "./Product";

export default class Order {

    cpf: Cpf;
    code: String;
    items: Item[] = [];
    coupon!: Coupon;
    freight: number = 0;
    subtotal: number = 0;

    constructor (
        cpf: string,
        date: Date = new Date(),
        sequence: number = 1
    ) {
        this.cpf = new Cpf(cpf);
        this.code = new OrderCode(date, sequence).getCode();
    }

    addItem (product: Product, quantity: number) {
        if (this.isItemDuplicated(product)) throw new Error('Duplicated products');
        const newItem = new Item(product.idProduct, product.price, quantity);
        this.items.push( newItem );
        const freightCalculator = new FreightCalculator();
        this.subtotal += newItem.getTotal();
        this.freight += freightCalculator.calculate(product);
    }

    addCoupon (coupon: Coupon) {
        this.coupon = coupon;
    }

    isItemDuplicated(product: Product) {
        return this.items.some(item => item.idProduct === product.idProduct);
    }

    getTotal() {
        let total = this.subtotal + this.freight;
        if (this.coupon && !this.coupon.isExpired()) {
            total -= this.coupon.getDiscount(total);
        }
        return total;
    }

}