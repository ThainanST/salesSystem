import FreightCalculator from "../src/FreightCalculator";

test('Deve calcular o frete para um produto', () => {
    const product = {
        idProduct: 1,
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

test('Deve calcular o frete para um produto com valor mínimo', () => {
    const product = {
        idProduct: 3,
        description: 'C',
        price: 30,
        width: 10,
        height: 10,
        length: 10,
        weight: 0.9,
        currency: 'BRL'
    };
    const freightCalculator = new FreightCalculator();
    const freight = freightCalculator.calculate(product);
    expect(freight).toBe(10);
});