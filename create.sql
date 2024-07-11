drop table sales.products;
drop table sales.coupons;
drop schema sales;

create schema sales;

create table sales.products (
    id_product integer primary key,
    description text,
    price numeric,
    width integer,
    height integer,
    length integer,
    weight numeric,
    currency text
);

create table sales.coupons (
    code text primary key,
    discount numeric,
    expire_date timestamp
);

insert into sales.products (id_product, description, price, width, height, length, weight, currency) values
    (1, 'A', 1000, 100, 30, 10, 3, 'BRL'),
    (2, 'B', 5000, 50,  50, 50, 22, 'BRL'),
    (3, 'C', 30,   10,  10, 10, 0.9, 'BRL'),
    (4, 'D', 100,  100, 30, 10, 3, 'USD');


insert into sales.coupons (code, discount, expire_date) values
    ('VALE20', 0.2, '2024-10-01T10:00:00'),
    ('VALE20_EXPIRED', 0.2, '2024-04-01T10:00:00'),
    ('VALE40', 0.4, '2024-10-01T10:00:00');