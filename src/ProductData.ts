export default interface ProductData {
    getProductById(idProduct: number): Promise<any>;
}