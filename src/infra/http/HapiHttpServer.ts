import HttpServer from "./HttpServer";
import Hapi from '@hapi/hapi';

export default class HapiHttpServer implements HttpServer {

    server: any;

    constructor() {
        this.server = Hapi.server({
            port: 3000, // Defina a porta padrão ou mude conforme necessário
            host: 'localhost'
        });
    }

    on(method: string, url: string, callback: Function): void {
        this.server.route({
            method: method.toUpperCase(),
            path: url,
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const output = await callback(request.params, request.payload);
                    return h.response(output).code(200);
                } catch (error: any) {
                    return h.response({ message: error.message }).code(422);
                }
            }
        });
    }

    async listen(port: number): Promise<void> {
        this.server.settings.port = port;
        await this.server.start();
        console.log(`Server is running on port ${port}`);
    }

}
