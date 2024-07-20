import ProductDataDatabase from "../src/ProductDataDatabase";
import CouponDataDatabase from "../src/CouponDataDatabase";
import Checkout from "../src/Checkout";
import GetOrderByCpf from "../src/GetOrderByCpf";
import OrderDataDatabase from "../src/OrderDataDatabase";

test("Deve consultar um pedido", async function () {
    const productData = new ProductDataDatabase();
    const couponData = new CouponDataDatabase();
    const orderData = new OrderDataDatabase();
    const checkout = new Checkout(productData, couponData, orderData);
    const input = {
        cpf: "987.654.321-00",
        items: [
            { id_product: 1, quantity: 1 },
            { id_product: 2, quantity: 1 },
            { id_product: 3, quantity: 3 }
        ]
    };
    await checkout.execute(input);
    const getOrderbyCpf = new GetOrderByCpf(orderData);
    const output = await getOrderbyCpf.execute("987.654.321-00");
    expect(output.total).toEqual(6350);
});