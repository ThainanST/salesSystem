import GetProduct from "../../application/GetProduct";
import GetProducts from "../../application/GetProducts";
import HttpServer from "../http/HttpServer";

export default class RestControler {

    constructor(
        readonly httpServer: HttpServer, 
        readonly getProduct: GetProduct, 
        readonly getProducts: GetProducts ) {
        
        httpServer.on('get', '/products', async function (params: any, body: any) {
            const products = await getProducts.execute();
            return products;
        });

        httpServer.on('get', '/product/:idProduct', async function (params: any, body: any) {
            const product = await getProduct.execute(params.idProduct);
            return product;
        });

    }
}