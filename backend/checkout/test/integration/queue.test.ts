import Checkout from "../../src/application/Checkout";
import CouponData from "../../src/domain/data/CouponData";
import OrderData from "../../src/domain/data/OrderData";
import ProductData from "../../src/domain/data/ProductData";
import Product from "../../src/domain/entities/Product";
import QueueController from "../../src/infra/queue/QueueController";
import sinon from "sinon";
import QueueMemory from "../../src/infra/queue/QueueMemory";

test("Deve fazer pedido com a fila", async function () {

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
    
    const queue = new QueueMemory();
    await queue.connect();
    const checkout = new Checkout(productDataFake, couponDataFake, orderDataFake);
    const checkoutSpy = sinon.spy(checkout, "execute");
    new QueueController(queue, checkout);

    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    await queue.publish("checkout", input);

    const [returnedValue] = checkoutSpy.returnValues;
    const output = await returnedValue;
    expect(output.code).toBe("202400000002");
    expect(output.total).toBe(6350);
    checkoutSpy.restore();
})