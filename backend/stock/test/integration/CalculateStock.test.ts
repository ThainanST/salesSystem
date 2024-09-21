import CalculateStock from "../../src/application/CalculateStock";
import PgpConnection from "../../src/infra/database/PgpConnection";
import StockEntryRepositoryDatabase from "../../src/infra/repository/StockEntryRepositoryDatabase";

test('Deve calcular o estoque de um produto', async function () {
    const dbConnection = new PgpConnection();
    const stockEntryRepository = new StockEntryRepositoryDatabase(dbConnection);
    const calculateStock = new CalculateStock(stockEntryRepository);
    const idProduct = 1;
    const output = await calculateStock.execute(idProduct);
    expect(output.total).toBe(0);
});