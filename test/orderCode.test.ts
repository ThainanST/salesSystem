import OrderCode from "../src/domain/entities/OrderCode";

test('Deve criar código do pedido', () => { 
    const code = new OrderCode(new Date('2024-10-01T10:00:00'), 1);
    expect(code.getCode()).toBe('202400000001');
});

test('Não deve criar código do pedido com sequencia negativa', () => { 
    expect( () => {
        new OrderCode(new Date('2024-10-01T10:00:00'), -1)
    }).toThrow(new Error('Invalid sequence') );
});