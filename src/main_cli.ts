import Checkout from "./application/Checkout";
import CLIController from "./infra/cli/CLIController";
import CLIHandler from "./infra/cli/CLIHandler";
import CouponDataDatabase from "./infra/data/CouponDataDatabase";
import OrderDataDatabase from "./infra/data/OrderDataDatabase";
import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import PgpConnection from "./infra/database/PgpConnection";

const connection = new PgpConnection();
const productData = new ProductDataDatabase(connection);
const couponData = new CouponDataDatabase(connection);
const orderData = new OrderDataDatabase(connection);
const checkout = new Checkout(productData, couponData, orderData);
const handler = new CLIHandler();
const controller = new CLIController(handler, checkout);

handler.type("set-cpf 123.456.789-09");
handler.type("set-cpf 123.456.789-10");