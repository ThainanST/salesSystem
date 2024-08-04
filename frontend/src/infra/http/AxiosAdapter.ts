import HttpClient from "./HttpClient";
import axios from 'axios';

export default class AxiosAdapter implements HttpClient{
    async get(baseUrl: string): Promise<any> {
        const response = await axios.get(baseUrl);
        return response.data;
    }
    async post(baseUrl: string, data: any): Promise<any> {
        const response = await axios.post(baseUrl, data);
        return response.data;  
    }
    
}