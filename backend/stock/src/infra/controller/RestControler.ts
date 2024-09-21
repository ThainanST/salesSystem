import HttpServer from "../http/HttpServer";

export default class RestControler {

    constructor(readonly httpServer: HttpServer) {
                
        httpServer.on('post', '/calculateFreight', async function (params: any, body: any) {

        });
    }
}