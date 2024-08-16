import ProductDataDatabase from "./infra/data/ProductDataDatabase";
import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestControler from "./infra/controller/RestContoler";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import GetProducts from "./application/GetProducts";
import GetProduct from "./application/GetProduct";
import PgpSConnection from "./infra/database/PgpSConnection";

const httpServer = new ExpressHttpServer();
// const httpServer = new HapiHttpServer();

const dbConnection = PgpSConnection.getInstance();
const productData = new ProductDataDatabase(dbConnection);
const getProducts = new GetProducts(productData);
const getProduct = new GetProduct(productData);
new RestControler(httpServer, getProduct, getProducts);
const port = 3002;
httpServer.listen(port);