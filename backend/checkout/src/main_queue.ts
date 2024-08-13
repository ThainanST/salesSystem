import Checkout from "./application/Checkout";
import PgpConnection from "./infra/database/PgpConnection";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/queue/QueueController";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "./infra/gateway/CatalogGatewayHttp";


async function init () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const connection = new PgpConnection();
    const catalogGateway = new CatalogGatewayHttp();
    const couponData = new CouponDataDatabase(connection);
    const orderData = new OrderDataDatabase(connection);
    const freightGateway = new FreightGatewayHttp();
    const checkout = new Checkout(catalogGateway, couponData, orderData, freightGateway);
    new QueueController(queue, checkout);
}

init();