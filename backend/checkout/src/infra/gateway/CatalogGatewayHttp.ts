import axios from "axios";
import CatalogGateway from "./CatalogGateway";
import Product from "../../domain/entities/Product";

export default class CatalogGatewayHttp implements CatalogGateway {
    async getProduct(idProduct: number): Promise<any> {
        const response = await axios.get(`http://localhost:3002/product/${idProduct}`);
        if (response.status === 422) throw new Error('Product not found');
        const product = response.data;
        return new Product(
            product.idProduct,
            product.description,
            product.price,
            product.width,
            product.height,
            product.length,
            product.weight,
            product.currency,
        );
    }
}