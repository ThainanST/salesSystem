drop table sales.products;
drop table sales.cupons;
drop schema sales;

create schema sales;

create table sales.products (
    id_product integer primary key,
    description text,
    price numeric
);

create table sales.coupons (
    code text primary key,
    discount numeric
);

insert into sales.products (id_product, description, price) values
    (1, 'A', 1000),
    (2, 'B', 5000),
    (3, 'C', 30);


insert into sales.coupons (code, discount) values
    ('VALE20', 0.2),
    ('VALE30', 0.3),
    ('VALE40', 0.4);