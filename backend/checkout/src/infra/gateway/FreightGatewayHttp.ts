import axios from "axios";
import FreightGateway from "./FreightGateway";

export default class FreightGatewayHttp implements FreightGateway {
    async calculateFreight(items: { volume: number; density: number; quantity: number; }[], cepFrom?: string, cepTo?: string): Promise<any> {
        const input = { cepFrom: cepFrom, cepTo: cepTo, items: items };
        const response = await axios.post('http://localhost:3001/calculateFreight', input);
        return response.data;
    }

}