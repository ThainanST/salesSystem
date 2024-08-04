import sinon from 'sinon';
import Checkout from "../../src/application/Checkout";
import ProductData from "../../src/domain/data/ProductData";
import CouponData from "../../src/domain/data/CouponData";
import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CurrencyGateway from "../../src/infra/gateway/CurrencyGatewayRandom";
import MailerConsole from "../../src/infra/mailer/MailerConsole";
import Mailer from "../../src/infra/mailer/Mailer";
import OrderDataDatabase from '../../src/infra/data/OrderDataDatabase';
import OrderData from '../../src/domain/data/OrderData';
import Currencies from '../../src/domain/entities/Currencies';
import Product from '../../src/domain/entities/Product';

const productDataFake: ProductData = {
    async getProductById(idProduct: number): Promise<Product> {
            const products: { [idProduct: number] : Product } = {
                1: new Product( 1, 'A', 1000, 100, 30, 10, 3, 'BRL'),
                2: new Product( 2, 'B', 5000, 50, 50, 50, 22, 'BRL'),
                3: new Product( 3, 'C', 30, 10, 10, 10, 0.9, 'BRL'),
                4: new Product( 4, 'D', 100, 100, 30, 10, 3, 'USD'),
            };
            return products[idProduct];
        }
}

const couponDataFake: CouponData = {
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
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    // const productDataFake = new ProductDataDatabase();
    // const couponDataFake = new CouponDataDatabase();
    const checkout = new Checkout(productDataFake, couponDataFake);
    await expect(checkout.execute(input)).rejects.toThrow('Invalid cpf');
});

test("Deve fazer pedido com 3 produtos", async function () {
    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    // const productDataFake = new ProductDataDatabase();
    // const couponDataFake = new CouponDataDatabase();
    const checkout = new Checkout(productDataFake, couponDataFake);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6350);
});

test("Deve fazer pedido com 4 produtos e moedas diferentes com stub e spy", async function () {
    const currencyGatewayStub = sinon.stub(CurrencyGateway.prototype, 'getCurrencies')
    .resolves(
        (() => {
            const CurrencyQuotes = new Currencies();
            CurrencyQuotes.addCurrency("BRL", 1.0);
            CurrencyQuotes.addCurrency("USD", 3.0);
            CurrencyQuotes.addCurrency("EUR", 6.5);
            return CurrencyQuotes;
            }
        )()
    );
    const mailerSpy = sinon.spy(MailerConsole.prototype, 'send');

    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
            { idProduct: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productDataFake = new ProductDataDatabase();
    // const couponDataFake = new CouponDataDatabase();
    const checkout = new Checkout(productDataFake, couponDataFake);
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
        .resolves(
            (() => {
                const CurrencyQuotes = new Currencies();
                CurrencyQuotes.addCurrency("BRL", 1.0);
                CurrencyQuotes.addCurrency("USD", 3.0);
                CurrencyQuotes.addCurrency("EUR", 6.5);
                return CurrencyQuotes;
                }
            )()
        );

    const mailerMock = sinon.mock(MailerConsole.prototype);
    mailerMock.expects('send')
        .once()
        .withArgs("thainan@mail.com", "Pedido realizado com sucesso", "Obrigado por comprar conosco");

    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
            { idProduct: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productDataFake = new ProductDataDatabase();
    // const couponDataFake = new CouponDataDatabase();
    const checkout = new Checkout(productDataFake, couponDataFake);
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
        async getCurrencies(): Promise<Currencies> {
            const currencies = new Currencies();
            currencies.addCurrency("BRL", 1.0);
            currencies.addCurrency("USD", 3.0);
            currencies.addCurrency("EUR", 6.5);
            return currencies;
        }
    }

    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
            { idProduct: 4, quantity: 1 }
        ],
        email: "thainan@mail.com",
    };
    // const productDataFake = new ProductDataDatabase();
    // const couponDataFake = new CouponDataDatabase();
    const orderData = new OrderDataDatabase();
    const checkout = new Checkout(productDataFake, couponDataFake, orderData, currencyGatewayFake, mailerFake);
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
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    const orderDataFake: OrderData = {
        dbConnection: {
            open: function (): Promise<void> {
                throw new Error('Function not implemented.');
            },
            query: function (statement: string, params: any): Promise<any> {
                throw new Error('Function not implemented.');
            },
            close: function (): Promise<void> {
                throw new Error('Function not implemented.');
            }
        },
        async save(order: any): Promise<void> {},
        async getOrderByCpf(cpf: string): Promise<any> {},
        async count(): Promise<number> {
            return 1;
        }
    }

    const checkout = new Checkout(productDataFake, couponDataFake, orderDataFake);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6350);
    expect(output.code).toBe('202400000002');
});