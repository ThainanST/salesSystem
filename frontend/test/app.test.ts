import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";
import CheckoutGatewayHttp from "../src/infra/gateway/CheckoutGatewayHttp";
import ProductsGatewayHttp from "../src/infra/gateway/ProductsGatewayHttp";
import CheckoutGateway from "../src/infra/gateway/CheckoutGateway";
import ProductsGateway from "../src/infra/gateway/ProductsGateway";
import Products from "../src/domain/Products";
import AxiosAdapter from "../src/infra/http/AxiosAdapter";
import FetchAdapter from "../src/infra/http/FetchAdapter";

const formatCurrency = function (value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

async function sleep (time: number) {
    return new Promise((resolve) => setTimeout(() => {resolve(true)}, time));
}

let wrapper: any; 
beforeEach(() => {
    const httpClientAxios = new AxiosAdapter();
    const httpClientFetch = new FetchAdapter();
    const baseUrl = "http://localhost:3000";
    const CheckoutGateway = new CheckoutGatewayHttp(httpClientAxios, baseUrl);
    const ProductsGateway = new ProductsGatewayHttp(httpClientFetch, baseUrl);
    wrapper = mount(AppVue, {
        global: {
            provide: {
                CheckoutGateway,
                ProductsGateway
            }
        }
    });
});


test("Deve mostrar título e produtos", function () {
    expect(wrapper.get(".title").text()).toBe("Checkout");
    expect(wrapper.findAll(".product-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".product-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".product-price").at(0)?.text()).toBe(formatCurrency(1000));
    expect(wrapper.findAll(".product-price").at(1)?.text()).toBe(formatCurrency(5000));
    expect(wrapper.findAll(".product-price").at(2)?.text()).toBe(formatCurrency(30));
});


test("Deve ter um pedido vazio", function () {
    expect(wrapper.get(".total").text()).toBe( formatCurrency(0) );
});

test("Deve calcular total com 1 item", async function () {
    expect(wrapper.get(".total").text()).toBe( formatCurrency(0) );
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(1000) );
});

test("Deve calcular total com 1 item e fake", async function () {
    const CheckoutGateway: CheckoutGateway = {
        checkout: function (input: any): Promise<any> {
            return new Promise((resolve) => {
                resolve({code: 202400000002, total: 1030});
            });
        }
    };
    const ProductsGateway: ProductsGateway = {
        getProducts: function (): Promise<Products[]> {
            return new Promise((resolve) => {
                resolve([{idProduct: 4, description: 'D', price: 1000}])
            });
        }
    };
    wrapper = mount(AppVue, {
        global: {
            provide: {
                CheckoutGateway,
                ProductsGateway
            }
        }
    });
    expect(wrapper.get(".total").text()).toBe( formatCurrency(0) );
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(1000) );
    await wrapper.get(".confirm").trigger("click");
    await sleep(1000);
    expect(wrapper.get(".message").text()).toBe("Success");
    expect(wrapper.get(".order-code").text()).toBe("202400000002");
});

test("Deve verificar botão decrease, sem quantidade negativa", async function () {
    expect(wrapper.get(".total").text()).toBe( formatCurrency(0) );
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("2");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(2000) );
    expect(wrapper.findAll(".item-decrease-button").at(0)?.text()).toBe("-");
    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(1000) );
    await wrapper.findAll(".item-decrease-button").at(0)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBeUndefined();
    expect(wrapper.get(".total").text()).toBe( formatCurrency(0) );
});

test("Deve calcular total com 3 itens", async function () {
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6090) );
    expect(wrapper.findAll(".item-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".item-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".item-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(1)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("3");
});

test("Deve calcular total removendo itens", async function () {
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(1)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("3");
    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");
    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("1");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6030) );
});

test("Deve calcular total adicionando e removendo itens", async function () {
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(1000) );

    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6000) );

    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6030) );

    await wrapper.findAll(".item-increase-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6060) );

    await wrapper.findAll(".item-increase-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6090) );
    expect(wrapper.findAll(".item-quantity").at(0)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(1)?.text()).toBe("1");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("3");
    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6060) );
    await wrapper.findAll(".item-decrease-button").at(2)?.trigger("click");
    expect(wrapper.findAll(".item-quantity").at(2)?.text()).toBe("1");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(6030) );
});

test("Deve fazer checkout de pedido com 1 item", async function () {
    await sleep(1000);
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe( formatCurrency(1000) );
    await wrapper.get(".confirm").trigger("click");
    await sleep(1000);
    expect(wrapper.get(".message").text()).toBe("Success");
    const orderCode = parseInt(wrapper.get(".order-code").text(), 10);
    expect(orderCode).toBeGreaterThan(202400000002);
    expect(wrapper.get(".order-total").text()).toBe( formatCurrency(1030) );
});

test("Deve mostrar título e 4 produtos", async function () {
    await sleep(1000);
    expect(wrapper.get(".title").text()).toBe("Checkout");
    expect(wrapper.findAll(".product-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".product-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".product-description").at(3)?.text()).toBe("D");
    expect(wrapper.findAll(".product-price").at(0)?.text()).toBe(formatCurrency(1000));
    expect(wrapper.findAll(".product-price").at(1)?.text()).toBe(formatCurrency(5000));
    expect(wrapper.findAll(".product-price").at(2)?.text()).toBe(formatCurrency(30));
    expect(wrapper.findAll(".product-price").at(3)?.text()).toBe(formatCurrency(1000));
});