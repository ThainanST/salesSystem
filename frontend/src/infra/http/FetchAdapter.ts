import HttpClient from "./HttpClient";

export default class FetchAdapter implements HttpClient{
    async get(baseUrl: string): Promise<any> {
        const response = await fetch(baseUrl);
        return response.json();
    }
    async post(baseUrl: string, data: any): Promise<any> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(baseUrl, options);
        return response.json();
    }
    
}