import FreightCalculator from "../src/FreightCalculator";

test('Deve calcular o frete para um produto', () => {
    const product = {
        id_product: 1,
        description: 'A',
        price: 1000,
        width: 100,
        height: 30,
        length: 10,
        weight: 3,
        currency: 'BRL'
    };
    const freightCalculator = new FreightCalculator();
    const freight = freightCalculator.calculate(product);
    expect(freight).toBe(30);
});