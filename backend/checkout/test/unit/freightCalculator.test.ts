import FreightCalculator from "../../src/domain/entities/FreightCalculator";
import Product from "../../src/domain/entities/Product";

test('Deve calcular o frete para um produto', () => {
    const product = new Product(1, 'A', 1000, 100, 30, 10, 3);
    const freightCalculator = new FreightCalculator();
    const freight = freightCalculator.calculate(product);
    expect(freight).toBe(30);
});

test('Deve calcular o frete para um produto com valor mínimo', () => {
    const product = new Product(3, 'C', 30, 10, 10, 10, 0.9);
    const freightCalculator = new FreightCalculator();
    const freight = freightCalculator.calculate(product);
    expect(freight).toBe(10);
});