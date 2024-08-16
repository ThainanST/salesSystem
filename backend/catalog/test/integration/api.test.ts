import axios from "axios";

test('Deve retornar a lista de produtos', async function () {
    const response = await axios.get("http://localhost:3002/products");
    const products = response.data;
    expect(products).toHaveLength(4);
})

test('Deve retornar um produto', async function () {
    const response = await axios.get("http://localhost:3002/product/1");
    const product = response.data;
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


test('Deve retornar um erro ao tentar buscar um produto inexistente', async function () {
    await expect(axios.get("http://localhost:3002/product/99"))
        .rejects
        .toMatchObject({
            response: {
                status: 422,
                data: {
                    message: 'Product not found'
                }
            }
        });
});

test('Deve retornar uma lista de produtos', async function () {
    const list = [1, 2, 3];

    for (const idProduct of list) {
        let response = await axios.get(`http://localhost:3002/product/${idProduct}`);
        let product = response.data;
        expect(product.idProduct).toBe(idProduct);
    }

});