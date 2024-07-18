import pgp from 'pg-promise';

export async function getProductById (id_product: number) {
    const postgresUser = 'postgres';
    const postgresPassword = '123456';
    const postgresHost = 'localhost';
    const postgresPort = '5432';
    const postgresDatabase = 'app';
    const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
    const [product] = await connection.query("SELECT * FROM sales.products WHERE id_product = $1;", [id_product]);
    await connection.$pool.end();
    return product;
}

export async function getCouponByCode (code: string) {
    const postgresUser = 'postgres';
    const postgresPassword = '123456';
    const postgresHost = 'localhost';
    const postgresPort = '5432';
    const postgresDatabase = 'app';
    const connection = pgp()(`postgres://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`);
    const [objCoupon] = await connection.query("SELECT * FROM sales.coupons WHERE code = $1;", [code]);
    await connection.$pool.end();
    return objCoupon;
}