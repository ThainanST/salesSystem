import FreightCalculator from "../../src/domain/entities/FreightCalculator";

test('Deve calcular o frete para um produto com distancia padrão, produto A', () => {
    const freight = FreightCalculator.calculate(0.03, 100);
    expect(freight).toBe(30);
});

test('Deve calcular o frete para um produto com valor mínimo, produto C', () => {
    const freight = FreightCalculator.calculate(0.01, 100);
    expect(freight).toBe(10);
});

test('Deve calcular o frete para um produto B', () => {
    const freight = FreightCalculator.calculate(0.125, 176);
    expect(freight).toBe(220);
});

test('Deve calcular o frete para um produto com distancia variável, produto A', () => {
    const distance = 748.2217780081631;
    const freight = FreightCalculator.calculate(0.03, 100, distance);
    expect(freight).toBe(22.45);
});