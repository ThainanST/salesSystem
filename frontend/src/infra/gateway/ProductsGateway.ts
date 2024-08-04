import Products from "../../domain/Products";

export default interface ProductsGateway {
    getProducts(): Promise<Products[]>;
}