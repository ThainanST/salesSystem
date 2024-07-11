import { validate } from './CpfValidator';
import CouponData from './CouponData';
import ProductData from './ProductData';
import CurrencyGatewayRandom from './CurrencyGatewayRandom';
import CurrencyGateway from './CurrencyGateway';
import Mailer from './Mailer';
import MailerConsole from './MailerConsole';

export default class Checkout {

    constructor (
        readonly productData: ProductData,
        readonly couponData: CouponData,
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
        let itemFreight = 0;
        let volume = 0;
        let density = 0;
        const currencies: any = await this.currencyGateway.getCurrencies();
        for (let item of products) {
            const product = await this.productData.getProductById(item.id_product);
            if (product) {
                if (item.quantity <= 0) {
                    throw new Error('Quantity must be positive');
                }
                total += parseFloat(product.price) * item.quantity * currencies[product.currency];
                volume = parseFloat(product.width) * parseFloat(product.height) * parseFloat(product.length) / 1000000;
                density = parseFloat(product.weight) / volume;
                itemFreight = 1000 * volume * (density /100);
                freight += itemFreight >= 10 ? itemFreight : 10;
            }
            else {
                throw new Error('Product not found');
            }
        }
        if (input.coupon) {
            const myCuponCode = input.coupon;
            const objCoupon = await this.couponData.getCouponByCode(myCuponCode);
            const today = new Date();
            if (objCoupon  ) {
                if (today < objCoupon.expire_date.getTime() ) {
                    total = total * (1 - objCoupon.discount );
                }
                else {
                    total += freight;
                    return {
                        total: total,
                        freight: freight,
                        message: 'Coupon expired'
                    };
                }
            }
            else {
                total += freight;
                throw new Error('Coupon not found');
            }
        }
        total += freight;
        if (input.email) {
            this.mailer.send(input.email, 'Pedido realizado com sucesso', 'Obrigado por comprar conosco');
        }
        return {
            total: total,
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