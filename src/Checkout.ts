import { validate } from './CpfValidator';
import CouponData from './CouponData';
import ProductData from './ProductData';
import CurrencyGatewayRandom from './CurrencyGatewayRandom';
import CurrencyGateway from './CurrencyGateway';
import Mailer from './Mailer';
import MailerConsole from './MailerConsole';
import OrderDataDatabase from './OrderDataDatabase';
import FreightCalculator from './FreightCalculator';
import ValidateCoupon from './ValidateCoupon';
import OrderCode from './OrderCode';

export default class Checkout {

    constructor (
        readonly productData: ProductData,
        readonly couponData: CouponData,
        readonly orderData: OrderDataDatabase = new OrderDataDatabase(),
        readonly currencyGateway: CurrencyGateway = new CurrencyGatewayRandom(),
        readonly mailer: Mailer = new MailerConsole(),
    ) {

    }

    async execute (input: Input) {
        const isCpfValid = validate(input.cpf);
        if (!isCpfValid) {
            throw new Error('Invalid cpf');
        }
        const products = input.items;
        const productsId = products.map( (prod: any) => prod.idProduct);
        const productsIdSet = new Set(productsId);
        if (productsId.length !== productsIdSet.size) {
            throw new Error('Duplicated products');
        }
        let total = 0;
        let freight = 0;
        const freightCalculator = new FreightCalculator();
        const currencies: any = await this.currencyGateway.getCurrencies();
        for (let item of products) {
            const product = await this.productData.getProductById(item.idProduct);
            if (product) {
                if (item.quantity <= 0) {
                    throw new Error('Quantity must be positive');
                }
                total += parseFloat(product.price) * item.quantity * currencies[product.currency];
                freight += freightCalculator.calculate(product);
            }
            else {
                throw new Error('Product not found');
            }
        }
        if (input.coupon) {
            const coupon = await this.couponData.getCouponByCode(input.coupon);
            if (coupon && !coupon.isExpired()) {
                total -= coupon.getDiscount(total);
            }
        }
        total += freight;
        if (input.email) {
            this.mailer.send(input.email, 'Pedido realizado com sucesso', 'Obrigado por comprar conosco');
        }

        const date = new Date();
        const sequence = await this.orderData.count() + 1;
        const orderCode = new OrderCode(date, sequence);
        await this.orderData.save({cpf: input.cpf, total: total});
        return {
            total: total,
            code: orderCode.getCode(),
            freight: freight
        };
    }
    
}

type Input = {
    cpf: string;
    items: {idProduct: number, quantity: number}[];
    coupon?: string;
    email?: string;
}