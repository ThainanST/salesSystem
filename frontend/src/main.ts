import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import CheckoutGatewayHttp from './infra/gateway/CheckoutGatewayHttp';
import ProductsGatewayHttp from './infra/gateway/ProductsGatewayHttp';
import { Axios } from 'axios';
import AxiosAdapter from './infra/http/AxiosAdapter';
import FetchAdapter from './infra/http/FetchAdapter';

const app = createApp(App)
const httpClientAxios = new AxiosAdapter();
const httpClientFetch = new FetchAdapter();
const baseUrl = "http://localhost:3000";

const checkoutGateway = new CheckoutGatewayHttp(httpClientFetch, baseUrl);
const productsGateway = new ProductsGatewayHttp(httpClientAxios, baseUrl);
app.provide("CheckoutGateway", checkoutGateway);
app.provide("ProductsGateway", productsGateway);
app.mount('#app');
