import { validate } from '../domain/entities/CpfValidator';
import CouponData from '../domain/data/CouponData';
import ProductData from '../domain/data/ProductData';
import CurrencyGatewayRandom from '../infra/gateway/CurrencyGatewayRandom';
import CurrencyGateway from '../infra/gateway/CurrencyGateway';
import Mailer from '../infra/mailer/Mailer';
import MailerConsole from '../infra/mailer/MailerConsole';
import OrderDataDatabase from '../infra/data/OrderDataDatabase';
import FreightCalculator from '../domain/entities/FreightCalculator';
import ValidateCoupon from '../ValidateCoupon';
import OrderCode from '../domain/entities/OrderCode';
import Order from '../domain/entities/Order';

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
        const sequence = await this.orderData.count() + 1;
        const currenciesQuotes = await this.currencyGateway.getCurrencies();
        const order = new Order(
            input.cpf,
            new Date(),
            sequence,
            currenciesQuotes
        );
        for (let item of input.items) {
            const product = await this.productData.getProductById(item.idProduct);
            order.addItem(product, item.quantity);
        }
        if (input.coupon) {
            const coupon = await this.couponData.getCouponByCode(input.coupon);
            order.addCoupon(coupon);
        }
        await this.orderData.save(order);
        if (input.email) {
            this.mailer.send(input.email, 'Pedido realizado com sucesso', 'Obrigado por comprar conosco');
        }
        return {
            total: order.getTotal(),
            code: order.getCode(),
            freight: order.getFreight()
        };


        // const isCpfValid = validate(input.cpf);
        // if (!isCpfValid) {
        //     throw new Error('Invalid cpf');
        // }
        // const products = input.items;
        // const productsId = products.map( (prod: any) => prod.idProduct);
        // const productsIdSet = new Set(productsId);
        // if (productsId.length !== productsIdSet.size) {
        //     throw new Error('Duplicated products');
        // }
        // let total = 0;
        // let freight = 0;
        // const freightCalculator = new FreightCalculator();
        // const currencies: any = await this.currencyGateway.getCurrencies();
        // for (let item of products) {
        //     const product = await this.productData.getProductById(item.idProduct);
        //     if (product) {
        //         if (item.quantity <= 0) {
        //             throw new Error('Quantity must be positive');
        //         }
        //         total += parseFloat(product.price) * item.quantity * currencies[product.currency];
        //         freight += freightCalculator.calculate(product);
        //     }
        //     else {
        //         throw new Error('Product not found');
        //     }
        // }
        // if (input.coupon) {
        //     const coupon = await this.couponData.getCouponByCode(input.coupon);
        //     if (coupon && !coupon.isExpired()) {
        //         total -= coupon.getDiscount(total);
        //     }
        // }
        // total += freight;
        // if (input.email) {
        //     this.mailer.send(input.email, 'Pedido realizado com sucesso', 'Obrigado por comprar conosco');
        // }

        // const date = new Date();
        // const sequence = await this.orderData.count() + 1;
        // const orderCode = new OrderCode(date, sequence);
        // await this.orderData.save({cpf: input.cpf, total: total});
        
    }
    
}

type Input = {
    cpf: string;
    items: {idProduct: number, quantity: number}[];
    coupon?: string;
    email?: string;
}