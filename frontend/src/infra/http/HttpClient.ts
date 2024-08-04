export default interface HttpClient {
    get (baseUrl: string): Promise<any>;
    post (baseUrl: string, data: any): Promise<any>;
}