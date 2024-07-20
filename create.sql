create schema sales;

create table sales.products (
    idProduct integer primary key,
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

insert into sales.products (idProduct, description, price, width, height, length, weight, currency) values
    (1, 'A', 1000, 100, 30, 10, 3, 'BRL'),
    (2, 'B', 5000, 50,  50, 50, 22, 'BRL'),
    (3, 'C', 30,   10,  10, 10, 0.9, 'BRL'),
    (4, 'D', 100,  100, 30, 10, 3, 'USD');


insert into sales.coupons (code, discount, expire_date) values
    ('VALE20', 0.2, '2024-10-01T10:00:00'),
    ('VALE20_EXPIRED', 0.2, '2024-04-01T10:00:00'),
    ('VALE40', 0.4, '2024-10-01T10:00:00');


create table sales.order (
    id_order serial primary key,
    code text,
    coupon_code text,
    coupon_discount numeric,
    cpf text,
    email text,
    issue_date timestamp,
    freight numeric,
    total numeric,
    sequence integer
);

create table sales.order_items (
    id_order integer references sales.order(id_order),
    idProduct integer references sales.products(idProduct),
    price numeric,
    quantity integer,
    primary key (id_order, idProduct)
);