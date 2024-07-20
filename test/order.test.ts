import Coupon from "../src/Coupon";
import Order from "../src/Order";
import Product from "../src/Product";

test('Deve fazer uma ordem com pedido vazio', function () {
    const order = new Order("987.654.321-00");
    expect(order.getTotal()).toBe(0);
});

test('Não deve fazer ordem com cpf inválido', function () {
    expect( () => new Order("111.111.111-11")).toThrow(new Error('Invalid cpf'));
});

test('Deve fazer uma ordem com 3 itens', function () {
    const order = new Order("987.654.321-00");
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    order.addItem(new Product(2, 'B', 5000, 50,  50, 50, 22, 'BRL'), 1);
    order.addItem(new Product(3, 'C', 30,   10,  10, 10, 0.9, 'BRL'), 3);
    expect(order.getTotal()).toBe(6350);
});

test('Deve fazer uma ordem com 3 itens + coupon', function () {
    const order = new Order("987.654.321-00");
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    order.addItem(new Product(2, 'B', 5000, 50,  50, 50, 22, 'BRL'), 1);
    order.addItem(new Product(3, 'C', 30,   10,  10, 10, 0.9, 'BRL'), 3);
    order.addCoupon(new Coupon('VALE20', 0.2, new Date('2024-10-01T10:00:00')));
    expect(order.getTotal()).toBe(5080);
});

test('Não deve fazer pedido com q<0', function () {
    const order = new Order("987.654.321-00");
    expect(() => {
        order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), -1);
    }).toThrow('Quantity must be positive');
});

test('Não deve criar ordem com produto duplicado', function () {
    const order = new Order("987.654.321-00");
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    expect( () => {
        order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    }).toThrow('Duplicated products');
});

test('Deve fazer uma ordem com 3 itens e código da ordem', function () {
    const cpf = "987.654.321-00";
    const date = new Date('2024-10-01T10:00:00');
    const sequence = 1;
    const order = new Order(cpf, date, sequence);
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    expect(order.code).toBe('202400000001');
});