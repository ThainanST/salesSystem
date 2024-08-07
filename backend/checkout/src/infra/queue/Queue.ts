export default interface Queue {
    
    connect(): Promise<any>;
    on(queueName: string, callback: Function): Promise<void>;
    publish(queueName: string, data: any): Promise<void>;
}