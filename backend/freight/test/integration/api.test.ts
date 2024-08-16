import axios from "axios";
import ZipcodeData from "../../src/domain/data/ZipcodeData";
import Zipcode from "../../src/domain/entities/Zipcode";
import PgpConnection from "../../src/infra/database/PgpConnection";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";

// Override axios to treat all HTTP responses as successful regardless of status code.
axios.defaults.validateStatus = function () {
    return true;    
};

const port = 3001;


const zipcodeDataFake: ZipcodeData = {
    get: function (code: string): Promise<Zipcode | undefined> {
        if (code === '22030060') {
            const zipCode = new Zipcode('22030060', '', '', -27.5945, -48.5477);
            return Promise.resolve(zipCode);
        }
        if (code === '88015600') {
            const zipCode = new Zipcode('88015600', '', '', -22.9129, -43.2003);
            return Promise.resolve(zipCode);
        }
        return Promise.resolve(undefined);
    }
};

test('Deve simular frete para um pedido sem ceps', async function () {
    const input = {
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const response = await axios.post(`http://localhost:${port}/calculateFreight`, input);
    const output = response.data;
    expect(output.freight).toBe(30);
});

test("Deve calcular o frete", async function () {
    const input = {
        cepFrom: '22030060',
        cepTo: '88015600',
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const response = await axios.post(`http://localhost:${port}/calculateFreight`, input);
    const output = response.data;
    expect(output.freight).toBe(22.45);
});

test('Deve simular frete para um pedido com ceps usando fake', async function () {
    const input = {
        cepFrom: '22030060',
        cepTo: '88015600',
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const response = await axios.post(`http://localhost:${port}/calculateFreight`, input);
    const output = response.data;
    expect(output.freight).toBe(22.45);
});

test('Deve simular frete para um pedido com ceps usando banco de dados', async function () {
    const input = {
        cepFrom: '22030060',
        cepTo: '88015600',
        items: [
            {volume: 0.03, density: 100, quantity: 1}
        ]
    };
    const dbConnection = new PgpConnection();
    const zipcodeData = new ZipcodeDataDatabase(dbConnection);
    const response = await axios.post(`http://localhost:${port}/calculateFreight`, input);
    const output = response.data;
    expect(output.freight).toBe(22.45);
});