import ProductDataDatabase from "../src/ProductDataDatabase";
import SimulateFreight from "../src/SimulateFreight";

test('Deve simular frete para um pedido', async function () {
    const input = { 
        items: [
            {id_product: 1, quantity: 1}
        ]
    };
    const productData = new ProductDataDatabase();
    const simulateFreight = new SimulateFreight(productData);
    const output = await simulateFreight.execute(input);
    expect(output).toBe(30);
});