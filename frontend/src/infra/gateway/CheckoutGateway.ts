import Products from "../../domain/Products";

export default interface CheckoutGateway {
    checkout(input: any): Promise<any>;
}
