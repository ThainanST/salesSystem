import ProductDataDatabase from "../src/infra/data/ProductDataDatabase";
import CouponDataDatabase from "../src/infra/data/CouponDataDatabase";
import Checkout from "../src/application/Checkout";
import GetOrderByCpf from "../src/application/GetOrderByCpf";
import OrderDataDatabase from "../src/infra/data/OrderDataDatabase";
import pg from "pg-promise/typescript/pg-subset";
import pgPromise from "pg-promise";


test("Deve consultar um pedido", async function () {
    const productData = new ProductDataDatabase();
    const couponData = new CouponDataDatabase();
    const orderData = new OrderDataDatabase();
    const checkout = new Checkout(productData, couponData, orderData);
    const input = {
        cpf: "987.654.321-00",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    await checkout.execute(input);
    const getOrderbyCpf = new GetOrderByCpf(orderData);
    const output = await getOrderbyCpf.execute("987.654.321-00");
    expect(output.total).toEqual(6350);
});