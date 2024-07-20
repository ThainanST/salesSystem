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
        const productsId = products.map( (prod: any) => prod.id_product);
        const productsIdSet = new Set(productsId);
        if (productsId.length !== productsIdSet.size) {
            throw new Error('Duplicate products');
        }
        let total = 0;
        let freight = 0;
        const freightCalculator = new FreightCalculator();
        const currencies: any = await this.currencyGateway.getCurrencies();
        for (let item of products) {
            const product = await this.productData.getProductById(item.id_product);
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


            // const today = new Date();
            // if (objCoupon  ) {
            //     if (today < objCoupon.expire_date.getTime() ) {
            //         total = total * (1 - objCoupon.discount );
            //     }
            //     else {
            //         total += freight;
            //         return {
            //             total: total,
            //             freight: freight,
            //             message: 'Coupon expired'
            //         };
            //     }
            // }
            // else {
            //     total += freight;
            //     throw new Error('Coupon not found');
            // }
        }
        total += freight;
        if (input.email) {
            this.mailer.send(input.email, 'Pedido realizado com sucesso', 'Obrigado por comprar conosco');
        }
        const date = new Date();
        const year = date.getFullYear();
        const sequence = await this.orderData.count();
        const code = `${year}${sequence.toString().padStart(8, '0')}`;
        await this.orderData.save({cpf: input.cpf, total: total});
        return {
            total: total,
            code: code,
            freight: freight
        };
    }
    
}

type Input = {
    cpf: string;
    items: {id_product: number, quantity: number}[];
    coupon?: string;
    email?: string;
}