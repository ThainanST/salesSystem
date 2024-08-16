import axios from "axios";
import Product from "../../src/domain/entities/Product";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";

axios.defaults.validateStatus = function () {
    return true;    
};

test('Deve consultar produto', async function () {
    const catalogGateway = new CatalogGatewayHttp();
    const product: Product = await catalogGateway.getProduct(1);
    expect(product.idProduct).toBe(1);
    expect(product.description).toBe("A");
    expect(product.price).toBe(1000);
    expect(product.width).toBe(100);
    expect(product.height).toBe(30);
    expect(product.length).toBe(10);
    expect(product.weight).toBe(3);
    expect(product.currency).toBe("BRL");
    
});

test('Deve consultar produto inexistente', async function () {
    const catalogGateway = new CatalogGatewayHttp();
    await expect( catalogGateway.getProduct(99) ).rejects.toThrow('Product not found');
      
});


test('Deve consultar uma lista de produtos', async function () {
    const catalogGateway = new CatalogGatewayHttp();
    const list = [1, 2, 3, 4];
    for (const idProduct of list) {
        let product: Product = await catalogGateway.getProduct(idProduct);
        expect(product.idProduct).toBe(idProduct);
    } 
});

test('Deve consultar uma lista de produtos, com um deles inexistente', async function () {
    const catalogGateway = new CatalogGatewayHttp();
    const list = [1, 2, 99, 4];
    for (const idProduct of list) {
        if (idProduct === 99) {
            await expect( catalogGateway.getProduct(99) ).rejects.toThrow('Product not found');
            continue;
        }
        let product: Product = await catalogGateway.getProduct(idProduct);
        expect(product.idProduct).toBe(idProduct);
    } 
});