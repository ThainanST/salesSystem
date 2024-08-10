import CouponData from '../domain/data/CouponData';
import ProductData from '../domain/data/ProductData';
import CurrencyGatewayRandom from '../infra/gateway/CurrencyGatewayRandom';
import CurrencyGateway from '../infra/gateway/CurrencyGateway';
import Mailer from '../infra/mailer/Mailer';
import MailerConsole from '../infra/mailer/MailerConsole';
import OrderDataDatabase from '../infra/data/OrderDataDatabase';
import Order from '../domain/entities/Order';
import ProductDataDatabase from '../infra/data/ProductDataDatabase';
import CouponDataDatabase from '../infra/data/CouponDataDatabase';
import CalculateFreight from './CalculateFreight';

export default class Checkout {

    constructor (
        readonly productData: ProductData = new ProductDataDatabase(),
        readonly couponData: CouponData = new CouponDataDatabase(),
        readonly orderData: OrderDataDatabase = new OrderDataDatabase(),
        readonly CalculateFreight: CalculateFreight,
        readonly currencyGateway: CurrencyGateway = new CurrencyGatewayRandom(),
        readonly mailer: Mailer = new MailerConsole(),
    ) {

    }

    async execute (input: Input) {
        const sequence = await this.orderData.count() + 1;
        const currenciesQuotes = await this.currencyGateway.getCurrencies();
        const order = new Order( input.cpf, new Date(), sequence, currenciesQuotes );
        for (let item of input.items) {
            const product = await this.productData.getProductById(item.idProduct);
            order.addItem(product, item.quantity);
        }
        const inputCalculateFreight = { cepFrom: input.cpfFrom, cepTo: input.cpfTo, items: input.items};
        const freightOutput = await this.CalculateFreight.execute(inputCalculateFreight);
        order.freight = freightOutput.freight;
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
    }
    
}

type Input = {
    cpfFrom?: string;
    cpfTo?: string;
    cpf: string;
    items: {idProduct: number, quantity: number}[];
    coupon?: string;
    email?: string;
}