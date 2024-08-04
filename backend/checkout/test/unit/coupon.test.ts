import Coupon from "../../src/domain/entities/Coupon";

test('Deve testar se o coupon não expirado e pegar desconto', function () {
    const code = 'VALE20';
    const discount = 0.2;
    const expire_date = new Date('2024-10-01T10:00:00');
    const coupon = new Coupon(
        code,
        discount,
        expire_date
    );
    const isExpired = coupon.isExpired();
    expect(isExpired).toBeFalsy();
    expect(coupon.getDiscount(1000)).toBe(200);
});

test('Deve testar coupon expirado', function () {
    const code = 'VALE20_EXPIRED';
    const discount = 0.2;
    const expire_date = new Date('2024-04-01T10:00:00');
    const coupon = new Coupon(
        code,
        discount,
        expire_date
    );
    const isExpired = coupon.isExpired();
    expect(isExpired).toBeTruthy();
});