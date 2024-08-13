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
})