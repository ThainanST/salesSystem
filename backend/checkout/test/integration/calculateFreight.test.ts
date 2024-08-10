import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import CalculateFreight from "../../src/application/CalculateFreight";
import ZipCodeData from "../../src/domain/data/ZipcodeData";
import ZipCode from "../../src/domain/entities/Zipcode";
import PgpConnection from "../../src/infra/database/PgpConnection";
import ZipcodeDataDatabase from "../../src/infra/data/ZipcodeDataDatabase";

const zipcodeDataFake: ZipCodeData = {
    get: function (code: string): Promise<ZipCode | undefined> {
        if (code === '22030060') {
            const zipCode = new ZipCode('22030060', '', '', -27.5945, -48.5477);
            return Promise.resolve(zipCode);
        }
        if (code === '88015600') {
            const zipCode = new ZipCode('88015600', '', '', -22.9129, -43.2003);
            return Promise.resolve(zipCode);
        }
        return Promise.resolve(undefined);
    }
};

test('Deve simular frete para um pedido sem ceps', async function () {
    const input = {
        items: [
            {idProduct: 1, quantity: 1}
        ]
    };
    const productData = new ProductDataDatabase();
    const calculateFreight = new CalculateFreight(productData, zipcodeDataFake);
    const output = await calculateFreight.execute(input);
    expect(output).toBe(30);
});

test('Deve simular frete para um pedido com ceps usando fake', async function () {
    const input = {
        cepFrom: '22030060',
        cepTo: '88015600',
        items: [
            {idProduct: 1, quantity: 1}
        ]
    };
    const productData = new ProductDataDatabase();
    const calculateFreight = new CalculateFreight(productData, zipcodeDataFake);
    const output = await calculateFreight.execute(input);
    expect(output).toBe(22.45);
});

test('Deve simular frete para um pedido com ceps usando banco de dados', async function () {
    const input = {
        cepFrom: '22030060',
        cepTo: '88015600',
        items: [
            {idProduct: 1, quantity: 1}
        ]
    };
    const dbConnection = new PgpConnection();
    const zipcodeData = new ZipcodeDataDatabase(dbConnection);
    const productData = new ProductDataDatabase();
    const calculateFreight = new CalculateFreight(productData, zipcodeData);
    const output = await calculateFreight.execute(input);
    expect(output).toBe(22.45);
});