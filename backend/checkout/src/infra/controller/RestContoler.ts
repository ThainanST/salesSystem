import Checkout from "../../application/Checkout";
import HttpServer from "../http/HttpServer";

export default class RestControler {

    constructor(readonly httpServer: HttpServer, readonly checkout: Checkout, port: number = 3000) {
        
        httpServer.on('get', '/products', async function (params: any, body: any) {
            const output = [
                { idProduct: 4, description: 'D', price: 1000 }
            ]
            return output;
        })
        
        httpServer.on('post', '/checkout', async function (params: any, body: any) {
            const output = await checkout.execute(body);
            return output;
        })

        httpServer.listen(port);
    }
}