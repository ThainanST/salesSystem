import StockCalculator from "../../src/domain/entities/StockCalculator";
import StockEntry from "../../src/domain/entities/StockEntry";

test('Deve calcular estoque de um produto sem estoque', function () {
    const stockEntries: StockEntry[] = [];
    const total = StockCalculator.calculate(stockEntries);
    expect(total).toBe(0);

});

test('Deve calcular estoque de um produto', function () {
    const stockEntries = [
        new StockEntry(1, "in", 10),
        new StockEntry(1, "out", 5),
        new StockEntry(1, "out", 2)
    ];
    const total = StockCalculator.calculate(stockEntries);
    expect(total).toBe(3);

});