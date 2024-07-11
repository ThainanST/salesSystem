import sinon from 'sinon';
import Checkout from "../src/Checkout";
import ProductData from "../src/ProductData";
import CouponData from "../src/CouponData";
import CouponDataDatabase from "../src/CouponDataDatabase";
import ProductDataDatabase from "../src/ProductDataDatabase";
import CurrencyGateway from "../src/CurrencyGateway";

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

test("Deve fazer pedido com 4 produtos e moedas diferentes", async function () {
    const currencyGatewayStub = sinon.stub(CurrencyGateway.prototype,'getCurrencies').resolves({
        "BRL": 1.0,
        "USD": 3.0,
        "EUR": 6.5
    });

    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 },
            { id_product: 4, quantity: 1 }
        ]
    };
    // const productData = new ProductDataDatabase();
    // const couponData = new CouponDataDatabase();
    const checkout = new Checkout(productData, couponData);
    const output = await checkout.execute(input);
    expect(output.total).toEqual(6680);
    currencyGatewayStub.restore();
});