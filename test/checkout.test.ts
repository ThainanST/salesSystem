import sinon from 'sinon';
import Checkout from "../src/Checkout";
import ProductData from "../src/ProductData";
import CouponData from "../src/CouponData";
import CouponDataDatabase from "../src/CouponDataDatabase";
import ProductDataDatabase from "../src/ProductDataDatabase";
import CurrencyGateway from "../src/CurrencyGatewayRandom";
import MailerConsole from "../src/MailerConsole";
import Mailer from "../src/Mailer";
import OrderDataDatabase from '../src/OrderDataDatabase';
import OrderData from '../src/OrderData';

const productData: ProductData = {
    async getProductById(id_product: number): Promise<any> {
            const products: { [id_product: number] : any } = {
                1: { id_product: 1, description: 'A', price: 1000, width: 100, height: 30, length: 10, weight: 3, currency: 'BRL' },
                2: { id_product: 2, description: 'B', price: 5000, width: 50, height: 50, length: 50, weight: 22, currency: 'BRL' },
                3: { id_product: 3, description: 'C', price: 30, width: 10, height: 10, length: 10, weight: 0.9, currency: 'BRL' },
                4: { id_product: 1, description: 'D', price: 100, width: 100, height: 30, length: 10, weight: 3, currency: 'USD' },
            };
            return products[id_product];
        }
}

const couponData: CouponData = {
    async getCouponByCode(code: string): Promise<any> {
        const coupons: any = {
            'VALE20': { code: 'VALE20', discount: 20, expire_date: '2024-10-01T10:00:00' },
            'VALE20_EXPIRED': { code: 'VALE20_EXPIRED', discount: 20, expire_date: '2024-04-01T10:00:00' },
            'VALE40': { code: 'VALE40', discount: 40, expire_date: '2024-10-01T10:00:00' },
        };
        return coupons[code];
    }
}

test("Não deve criar pedido com cpf inválido", async function () {
    const input = {
        cpf: "144.796.170-63",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const checkout = new Checkout(productData, couponData);
    await expect(checkout.execute(input)).rejects.toThrow('Invalid cpf');
});

test("Deve fazer pedido com 3 produtos", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const checkout = new Checkout(productData, couponData);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6350);
});

test("Deve fazer pedido com 4 produtos e moedas diferentes com stub e spy", async function () {
    const currencyGatewayStub = sinon.stub(CurrencyGateway.prototype,'getCurrencies').resolves({
        "BRL": 1.0,
        "USD": 3.0,
        "EUR": 6.5
    });
    const mailerSpy = sinon.spy(MailerConsole.prototype, 'send');

    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 },
            { id_product: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const checkout = new Checkout(productData, couponData);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6680);
    expect(mailerSpy.calledOnce).toBeTruthy();
    expect(mailerSpy.calledWith(
        "thainan@mail.com",
        "Pedido realizado com sucesso",
        "Obrigado por comprar conosco"
    )).toBeTruthy();

    currencyGatewayStub.restore();
    mailerSpy.restore();
});

test("Deve fazer pedido com 4 produtos e moedas diferentes com mock", async function () {
    const currencyGatewayMock = sinon.mock(CurrencyGateway.prototype);
    currencyGatewayMock.expects('getCurrencies')
        .once()
        .resolves({
            "BRL": 1.0,
            "USD": 3.0,
            "EUR": 6.5
        });

    const mailerMock = sinon.mock(MailerConsole.prototype);
    mailerMock.expects('send')
        .once()
        .withArgs("thainan@mail.com", "Pedido realizado com sucesso", "Obrigado por comprar conosco");

    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 },
            { id_product: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const checkout = new Checkout(productData, couponData);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6680);
    currencyGatewayMock.verify();
    mailerMock.verify();

    currencyGatewayMock.restore();
    mailerMock.restore();
});

test("Deve fazer pedido com 4 produtos e moedas diferentes com fake", async function () {
    const log: any = [];
    const mailerFake: Mailer = {
        async send(email: string, subject: string, message: string) {
            // console.log(email, subject, message);
            log.push({ email, subject, message });
        }
    }

    const currencyGatewayFake: CurrencyGateway = {
        async getCurrencies(): Promise<any> {
            return {
                "BRL": 1.0,
                "USD": 3.0,
                "EUR": 6.5
            };
        }
    }

    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 },
            { id_product: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const orderData = new OrderDataDatabase();
    const checkout = new Checkout(productData, couponData, orderData, currencyGatewayFake, mailerFake);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6680);
    expect(log).toHaveLength(1);
    expect(log[0].email).toBe("thainan@mail.com");
    expect(log[0].subject).toBe("Pedido realizado com sucesso");
    expect(log[0].message).toBe("Obrigado por comprar conosco");
});

test("Deve fazer pedido com 3 produtos com código do pedido", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    const orderDataFake: OrderData = {
        async save(order: any): Promise<void> {},
        async getOrderByCpf(cpf: string): Promise<any> {},
        async count(): Promise<number> {
            return 1;
        }
    }

    const checkout = new Checkout(productData, couponData, orderDataFake);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6350);
    expect(output.code).toBe('202400000001');
});