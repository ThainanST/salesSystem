import CheckoutGateway from "./CheckoutGateway";
import HttpClient from "../http/HttpClient";

export default class CheckoutGatewayHttp implements CheckoutGateway {

    constructor(readonly httpClient: HttpClient, readonly baseUrl: string) {

    }

    async checkout(input: any): Promise<any> {
        const output = await this.httpClient.post(`${this.baseUrl}/checkout`, input);
        return output;
    }

}