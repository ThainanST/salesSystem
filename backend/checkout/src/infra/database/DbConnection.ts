export default interface DbConnection {
    open(): Promise<void>;
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}