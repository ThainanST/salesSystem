import Checkout from "./application/Checkout";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import RestControler from "./infra/controller/RestContoler";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import PgpConnection from "./infra/database/PgpConnection";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "./infra/gateway/CatalogGatewayHttp";

const httpServer = new ExpressHttpServer();
// const httpServer = new HapiHttpServer();

const dbConnection = new PgpConnection();
const catalogGateway = new CatalogGatewayHttp();
const couponData = new CouponDataDatabase(dbConnection);
const orderData = new OrderDataDatabase(dbConnection);
const freightGateway = new FreightGatewayHttp();
const checkout = new Checkout(catalogGateway, couponData, orderData, freightGateway);
new RestControler(httpServer, checkout);
httpServer.listen(3000);