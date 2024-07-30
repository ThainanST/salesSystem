import Item from "./Item";
import OrderCode from "./OrderCode";
import Coupon from "./Coupon";
import Cpf from "./Cpf";
import Currencies from "./Currencies";
import FreightCalculator from "./FreightCalculator";
import Product from "./Product";

export default class Order {

    cpf: Cpf;
    code: String;
    items: Item[] = [];
    coupon!: Coupon;
    freight: number = 0;
    subtotal: number = 0;
    total: number = 0;
    currencyQuotes: Currencies;

    constructor (
        cpf: string,
        date: Date = new Date(),
        sequence: number = 1,
        currencyQuotes: Currencies = Order.getDefaultCurrency()
    ) {
        this.cpf = new Cpf(cpf);
        this.code = new OrderCode(date, sequence).getCode();
        this.currencyQuotes = currencyQuotes;
    }

    static getDefaultCurrency(): Currencies{
        const defaultCurrencies = new Currencies();
        defaultCurrencies.addCurrency('BRL', 1);
        return defaultCurrencies;
    }

    addItem (product: Product, quantity: number) {
        if (this.isItemDuplicated(product)) {
            throw new Error('Duplicated products');
        }
        const currencyQuoteItem: number = this.currencyQuotes.getExchange(product.currency);
        const newItem = new Item(
            product.idProduct,
            product.price,
            quantity,
            product.currency,
            currencyQuoteItem
        );
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

    calculateTotal() {
        this.total = this.subtotal + this.freight;
        if (this.coupon && !this.coupon.isExpired()) {
            this.total -= this.coupon.getDiscount(this.total);
        }
    }

    getTotal() {
        this.calculateTotal();
        return this.total;
    }

    getFreight() {
        return this.freight;
    }

    getCode() {
        return this.code;
    }

}

