import OrderData from './OrderData';

export default class GetOrderByCpf {
    
    orderData: OrderData;

    constructor ( orderData: OrderData){
        this.orderData = orderData;
    }

    async execute (cpf: string): Promise<Output> {
        const order = await this.orderData.getOrderByCpf(cpf);
        return {
            total: parseFloat(order.total),
        }
    }
}

type Output = {
    total: number,
}