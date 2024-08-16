import CouponData from '../domain/data/CouponData';
import CurrencyGatewayRandom from '../infra/gateway/CurrencyGatewayRandom';
import CurrencyGateway from '../infra/gateway/CurrencyGateway';
import Mailer from '../infra/mailer/Mailer';
import MailerConsole from '../infra/mailer/MailerConsole';
import OrderDataDatabase from '../infra/data/OrderDataDatabase';
import Order from '../domain/entities/Order';
import CouponDataDatabase from '../infra/data/CouponDataDatabase';
import FreightGateway from '../infra/gateway/FreightGateway';
import CatalogGateway from '../infra/gateway/CatalogGateway';

export default class Checkout {

    constructor (
        readonly catalogGateway: CatalogGateway,
        readonly couponData: CouponData = new CouponDataDatabase(),
        readonly orderData: OrderDataDatabase = new OrderDataDatabase(),
        readonly freightGateway: FreightGateway,
        readonly currencyGateway: CurrencyGateway = new CurrencyGatewayRandom(),
        readonly mailer: Mailer = new MailerConsole(),
    ) {

    }

    async execute (input: Input) {
        const sequence = await this.orderData.count() + 1;
        const currenciesQuotes = await this.currencyGateway.getCurrencies();
        const order = new Order( input.cpf, new Date(), sequence, currenciesQuotes );
        const freightItems: {volume: number, density: number, quantity: number}[] = [];
        for (let item of input.items) {
            let product = await this.catalogGateway.getProduct(item.idProduct);
            order.addItem(product, item.quantity);
            freightItems.push({ volume: product.getVolume(), density: product.getDensity(), quantity: item.quantity} );
        }
        const freightOutput = await this.freightGateway.calculateFreight( freightItems, input.cpfFrom,input.cpfTo);
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