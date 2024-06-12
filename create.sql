create schema sales;

create table sales.products (
    id_product integer primary key,
    description text,
    price numeric
);

insert into sales.products (id_product, description, price) values
    (1, 'A', 1000),
    (2, 'B', 5000),
    (3, 'C', 30);