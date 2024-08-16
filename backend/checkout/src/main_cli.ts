import Checkout from "./application/Checkout";
import CLIController from "./infra/cli/CLIController";
import CLIHandler from "./infra/cli/CLIHandler";
import CLIHandlerNode from "./infra/cli/CLIHandlerNode";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import PgpConnection from "./infra/database/PgpConnection";
import CatalogGatewayHttp from "./infra/gateway/CatalogGatewayHttp";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";

const connection = new PgpConnection();
const catalogGateway = new CatalogGatewayHttp();
const couponData = new CouponDataDatabase(connection);
const orderData = new OrderDataDatabase(connection);
const freightGateway = new FreightGatewayHttp();
const checkout = new Checkout(catalogGateway, couponData, orderData, freightGateway);
const handler = new CLIHandlerNode();
new CLIController(handler, checkout);
