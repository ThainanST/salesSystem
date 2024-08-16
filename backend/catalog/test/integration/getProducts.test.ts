import GetProducts from "../../src/application/GetProducts";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import PgpSConnection from "../../src/infra/database/PgpSConnection";

test('Deve consultar lista de produtos', async function () {
    const dbConnection = PgpSConnection.getInstance();
    const productData = new ProductDataDatabase(dbConnection);
    const getProduct = new GetProducts(productData);
    const products = await getProduct.execute();
    expect(products.length).toBe(4);
});