---
title: "Subquery factoring. WITH "
---

# Subquery factoring. `WITH`

Часть `WITH` SQL запроса используется для реализации
так называемого _Subquery factoring_. Эта возможность позволяет задать
подзапрос, который будет доступен в любом месте SQL запроса.
Subquery factoring в некоторых случаях значительно упрощает чтение и написание запросов.
Более того, велика вероятность того, что при использовании subquery
factoring БД построит более оптимальный план выполнения запроса.

Используя Subquery factoring, вы говорите БД о том, что указанный
подзапрос вероятно будет использоваться несколько раз в одном запросе,
и БД сможет предпринять действия, чтобы более эффективно повторно использовать его.

## Подготовка данных

```sql
create table books(
    id number primary key,
    book_name varchar2(400) not null,
    previous_id number,
    constraint books_prev_fk foreign key(previous_id)
        references books(id)
);

create table book_orders(
    id number primary key,
    book_id number not null,
    quantity number not null,
    order_date date not null
);

insert into books
values(1, 'book 1', null);

insert into books
values(2, 'Код Да Винчи', null);

insert into books
values(3, 'Ангелы и Демоны', 2);

insert into books
values(4, 'Инферно', 3);

insert into books
values(5, 'Утраченный символ', 4);

insert into book_orders
values(1, 1, 1, sysdate);

insert into book_orders
values(2, 2, 1, sysdate);

insert into book_orders
values(3, 2, 2, sysdate);

insert into book_orders
values(4, 3, 1, sysdate - 2);

insert into book_orders
values(5, 3, 1, sysdate - 3);

insert into book_orders
values(6, 4, 5, sysdate);
```

Здесь у нас список книг и список заказов.
Дополнительно, мы отслеживаем книги из одной серии, используя связь
книги и её [предыдущей части](/sql/basics/recursive/) ( подробнее про иерархические данные можно
почитать в соответствующем разделе,  ровно как и про [внешние ключи](/sql/dbobjects/foreignkeys/).

Теперь определим задачу: Вывести список книг, количество проданных экземпляров,
наряду с количеством проданных экземпляров её предыдущей части, если таковая имеется.

## Вариант без With

*Вариант 1*:

```sql
select bo.book_name,
       (select sum(quantity) from book_orders bord
        where bord.book_id = bo.id) sold_qty,
       pb.book_name prev_book_name,
       (select sum(quantity) from book_orders bord
        where bord.book_id = pb.id) prev_sold_qty
from books bo
left join books pb on pb.id = bo.previous_id
order by bo.id
```

*Вариант 2*:

```sql
select bo.book_name,
       bc.s sold_qty,
       pb.book_name prev_book_name,
       pbc.s prev_sold_qty
from books bo
left join books pb on pb.id = bo.previous_id
left join (
    select sum(quantity) s, book_id
    from book_orders
    group by book_id) bc on bc.book_id = bo.id
left join (
    select sum(quantity) s, book_id
    from book_orders
    group by book_id) pbc on pbc.book_id = pb.id
order by bo.id
```
В обоих случаях мы используем подзапросы — в первом в части SELECT, во втором — в части FROM.
Оба варианта дадут один и тот же результат:

|BOOK_NAME| SOLD_QTY|PREV_BOOK_NAME|PREV_SOLD_QTY|
|-|-|-|-|
|book 1| 1| - |- |
|Код Да Винчи| 3|- |- |
|Ангелы и Демоны|2|Код Да Винчи|3|
|Инферно|5|Ангелы и Демоны|2|
|Утраченный символ|-|Инферно|5|

## Вариант с WITH

```sql
with book_cnt as(
    select book_id, sum(quantity) s
    from book_orders
    group by book_id
)
select bo.book_name,
       bc.s sold_qty,
       pb.book_name prev_book_name,
       pbc.s prev_sold_qty
from books bo
left join book_cnt bc on bc.book_id = bo.id
left join books pb on pb.id = bo.previous_id
left join book_cnt pbc on pbc.book_id = bo.previous_id
order by bo.id
```

Получим тот же результат:

|BOOK_NAME| SOLD_QTY|PREV_BOOK_NAME|PREV_SOLD_QTY|
|-|-|-|-|
|book 1| 1| - |- |
|Код Да Винчи| 3|- |- |
|Ангелы и Демоны|2|Код Да Винчи|3|
|Инферно|5|Ангелы и Демоны|2|
|Утраченный символ|-|Инферно|5|

При использовании subquery factoring, мы заранее указываем
подзапрос, к который хотим использовать повторно, даём ему
псевдоним( `book_cnt`) в нашем случае, и далее обращаемся в
основном запросе к этому псевдониму как к обычной таблице.
