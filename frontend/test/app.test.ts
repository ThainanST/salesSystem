import { mount } from "@vue/test-utils";
import AppVue from "../src/App.vue";

test("Deve testar o front", async function () {
    const wrapper = mount(AppVue, {});
    expect(wrapper.get(".title").text()).toBe("Checkout");
    expect(wrapper.findAll(".product-description").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product-price").at(0)?.text()).toBe("1000");
    expect(wrapper.findAll(".product-description").at(1)?.text()).toBe("B");
    expect(wrapper.findAll(".product-price").at(1)?.text()).toBe("5000");
    expect(wrapper.findAll(".product-description").at(2)?.text()).toBe("C");
    expect(wrapper.findAll(".product-price").at(2)?.text()).toBe("30");
    await wrapper.findAll(".product-add-button").at(0)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(1)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    await wrapper.findAll(".product-add-button").at(2)?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("6090");
})