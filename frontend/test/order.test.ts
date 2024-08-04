import Order from "../src/domain/Order";

test("Deve criar uma ordem vazia", function () {
    const order = new Order("987.654.321-00");
    expect(order.cpf).toBe("987.654.321-00");
    expect(order.items).toEqual([]);
    expect(order.code).toBe("");
    expect(order.getTotal()).toBe(0);
});

test("Deve adicionar um item e verificar o valor total, sem confirmar", function () {
    const order = new Order("987.654.321-00");
    order.addItem({ idProduct: 1, description: 'A', price: 1000 });
    expect(order.getTotal()).toBe(1000);
});

test("Deve criar pedido com 3 itens iguais", function () {
    const order = new Order("987.654.321-00");
    order.addItem({ idProduct: 1, description: 'A', price: 1000 });
    order.addItem({ idProduct: 1, description: 'A', price: 1000 });
    order.addItem({ idProduct: 1, description: 'A', price: 1000 });
    expect(order.getTotal()).toBe(3000);
    expect(order.items.length).toBe(1);
    expect(order.items[0].quantity).toBe(3);
})

test("Deve criar pedido com 3 itens diferentes", function () {
    const order = new Order("987.654.321-00");
    order.addItem({ idProduct: 1, description: 'A', price: 1000 });
    order.addItem({ idProduct: 2, description: 'B', price: 5000 });
    order.addItem({ idProduct: 3, description: 'C', price: 30 });
    expect(order.getTotal()).toBe(6030);
    expect(order.items.length).toBe(3);
    expect(order.items[0].quantity).toBe(1);
    expect(order.items[1].quantity).toBe(1);
    expect(order.items[2].quantity).toBe(1);
})