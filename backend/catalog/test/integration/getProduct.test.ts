import GetProduct from "../../src/application/GetProduct";
import ProductDataDatabase from "../../src/infra/data/ProductDataDatabase";
import PgpSConnection from "../../src/infra/database/PgpSConnection";

test('Deve retornar produto 1', async function () {
    const dbConnection = PgpSConnection.getInstance();
    const productData = new ProductDataDatabase(dbConnection);
    const getProduct = new GetProduct(productData);
    const product = await getProduct.execute(1);
    expect(product.idProduct).toBe(1);
    expect(product.description).toBe("A");
    expect(product.price).toBe(1000);
    expect(product.width).toBe(100);
    expect(product.height).toBe(30);
    expect(product.length).toBe(10);
    expect(product.weight).toBe(3);
    expect(product.currency).toBe("BRL");
    expect(product.volume).toBe(0.03);
    expect(product.density).toBe(100);
});

test('Deve retornar produto 4', async function () {
    const dbConnection = PgpSConnection.getInstance();
    const productData = new ProductDataDatabase(dbConnection);
    const getProduct = new GetProduct(productData);
    const product = await getProduct.execute(4);
    expect(product.idProduct).toBe(4);
    expect(product.description).toBe("D");
    expect(product.price).toBe(100);
    expect(product.width).toBe(100);
    expect(product.height).toBe(30);
    expect(product.length).toBe(10);
    expect(product.weight).toBe(3);
    expect(product.currency).toBe("USD");
    expect(product.volume).toBe(0.03);
    expect(product.density).toBe(100);
});

test('Deve consultar um produto inexistente', async function () {
    const dbConnection = PgpSConnection.getInstance();
    const productData = new ProductDataDatabase(dbConnection);
    const getProduct = new GetProduct(productData);
    await expect( getProduct.execute(99) ).rejects.toThrow('Product not found');
});

test('Deve retornar uma lista de produtos', async function () {
    const dbConnection = PgpSConnection.getInstance();
    const productData = new ProductDataDatabase(dbConnection);
    const getProduct = new GetProduct(productData);
    const list = [1, 2, 3];

    for (const idProduct of list) {
        const product = await getProduct.execute(idProduct);
        expect(product.idProduct).toBe(idProduct);
    }

});
