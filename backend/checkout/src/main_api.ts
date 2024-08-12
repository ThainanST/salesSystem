import Checkout from "./application/Checkout";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import RestControler from "./infra/controller/RestContoler";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import PgpConnection from "./infra/database/PgpConnection";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";

// const httpServer = new ExpressHttpServer();
const httpServer = new HapiHttpServer();

const dbConnection = new PgpConnection();
const productData = new ProductDataDatabase(dbConnection);
const couponData = new CouponDataDatabase(dbConnection);
const orderData = new OrderDataDatabase(dbConnection);
const freightGateway = new FreightGatewayHttp();
const checkout = new Checkout(productData, couponData, orderData, freightGateway);
const port = 3000;

new RestControler(httpServer, checkout, port);