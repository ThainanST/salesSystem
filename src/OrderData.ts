export default interface OrderData {
    save (order: any): Promise<void>;
    getOrderByCpf (cpf: string): Promise<any>;
    count(): Promise<number>;
}