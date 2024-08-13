import { Axios, AxiosError } from "axios";
import Product from "../../src/domain/entities/Product";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";

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
    try {
        const response = await catalogGateway.getProduct(99);
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data.message).toBe('Product not found');
    }

    // await expect( catalogGateway.getProduct(99) ).rejects.toThrow('Product not found');
      
});