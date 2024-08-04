import DbConnection from "../../infra/database/DbConnection";
import Order from "../entities/Order";

export default interface OrderData {
    dbConnection: DbConnection;
    save (order: Order): Promise<void>;
    getOrderByCpf (cpf: string): Promise<any>;
    count(): Promise<number>;
}