import Checkout from "./application/Checkout";
import PgpConnection from "./infra/database/PgpConnection";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/queue/QueueController";


async function init () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const connection = new PgpConnection();
    const productData = new ProductDataDatabase(connection);
    const couponData = new CouponDataDatabase(connection);
    const orderData = new OrderDataDatabase(connection);
    const checkout = new Checkout(productData, couponData, orderData);
    new QueueController(queue, checkout);
}

init();