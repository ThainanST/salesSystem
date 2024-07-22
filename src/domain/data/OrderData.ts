import Order from "../entities/Order";

export default interface OrderData {
    save (order: Order): Promise<void>;
    getOrderByCpf (cpf: string): Promise<any>;
    count(): Promise<number>;
}