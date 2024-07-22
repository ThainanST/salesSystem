import ProductDataDatabase from "../src/infra/data/ProductDataDatabase";
import SimulateFreight from "../src/application/SimulateFreight";

test('Deve simular frete para um pedido', async function () {
    const input = { 
        items: [
            {idProduct: 1, quantity: 1}
        ]
    };
    const productData = new ProductDataDatabase();
    const simulateFreight = new SimulateFreight(productData);
    const output = await simulateFreight.execute(input);
    expect(output).toBe(30);
});