import CouponDataDatabase from "../../src/infra/data/CouponDataDatabase";
import Checkout from "../../src/application/Checkout";
import GetOrderByCpf from "../../src/application/GetOrderByCpf";
import OrderDataDatabase from "../../src/infra/data/OrderDataDatabase";
import PgpConnection from "../../src/infra/database/PgpConnection";
import FreightGatewayHttp from "../../src/infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";
import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;    
};

test("Deve consultar um pedido", async function () {
    const dbConnection = new PgpConnection();
    const couponData = new CouponDataDatabase(dbConnection);
    const orderData = new OrderDataDatabase(dbConnection);
    const freightGateway = new FreightGatewayHttp();
    const catalogGateway = new CatalogGatewayHttp();
    const checkout = new Checkout(catalogGateway, couponData, orderData, freightGateway);
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
    expect(output.total).toEqual(6370);
});