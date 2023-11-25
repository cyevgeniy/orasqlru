---
title: Подзапросы в Oracle
---

# Подзапросы в Oracle

Подзапросы представляют собой обычные SQL-запросы, которые являются
частью другого SQL-запроса.

Подзапросы - важная часть в изучении SQL. Некоторые данные просто не
могут быть получены, если их не использовать. Далее будут рассмотрены
примеры использования подзапросов в Oracle.

## Подготовка тестовых данных

```sql
    create table books(
        book_id number primary key,
        book_name varchar2(200) not null,
        author varchar2(50 char) not null,
        release_year number not null
    );

    create table book_orders(
        book_id number not null,
        quantity number(2) not null,
        order_date date not null
    );


    comment on table books is 'Книги';
    comment on table book_orders is 'Статистика продаж за день';


    insert into books
    values(1, 'Властелин колец', 'Толкин', 1954);

    insert into books
    values(2, 'Гордость и предубеждение', 'Джейн Остин', 1813);

    insert into books
    values(3, 'Тёмные начала', 'Филип Пулман', 1995);

    insert into books
    values(4, 'Автостопом по галактике', 'Дуглас Адамс', 1979);

    insert into book_orders
    values(1, 1, to_date('31.12.2005', 'dd.mm.yyyy'));

    insert into book_orders
    values(1, 4, to_date('30.12.2005', 'dd.mm.yyyy'));

    insert into book_orders
    values(2, 2, to_date('10.05.2005', 'dd.mm.yyyy'));

    insert into book_orders
    values(2, 1, to_date('12.05.2005', 'dd.mm.yyyy'));

    insert into book_orders
    values(3, 2, to_date('05.11.2005', 'dd.mm.yyyy'));
```

## Подзапросы в where- части запроса

Получим информацию о продажах книги "Властелин колец":

```sql
    select bo.*
    from book_orders bo
    where bo.book_id = (
        select book_id
        from books
        where book_name = 'Властелин колец'
    );
```

![](/img/8_subqueries/wherepart_1.png)

Здесь использовался подзапрос, чтобы определить id книги с названием
"Властелин колец".

Если выполнить подзапрос отдельно:

```sql
    select book_id
    from books
    where book_name = 'Властелин колец'
```

То мы получим одну строку, которая будет содержать значение `book_id`,
равое 1. Поэтому самый первый запрос эквивалентен следующему:

```sql
    select bo.*
    from book_orders bo
    where bo.book_id = 1
```

Следует обратить внимание на то, что в данном случае подзапрос должен
возвращать только одну строку, состоящую из одной колонки. Следующие
запросы работать не будут:

```sql
    select bo.*
    from book_orders bo
    where bo.book_id = (
        select book_id,
                   book_name
            from books
            where book_name = 'Властелин колец'
    )
```

Данный запрос выдаст ошибку `ORA-00913: too many values`, т.к. подзапрос
возвращает одну строку с двумя колонками.

```sql
    select bo.*
    from book_orders bo
    where bo.book_id = (select book_id from books)
```

А здесь будет ошибка
`ORA-01427: single-row subquery returns more than one row`, что
переводится как "однострочный подзапрос возвращает более одной строки".
Из-за этого результат выполнения данного подзапроса нельзя подставить в
условие сравнения, т.к. сравнение должно работать с одиночными
значениями.

## Подзапросы в select-части

Подзапросы, которые возвращают одиночные значения, можно использовать
прямо в части `SELECT` в качестве колонок. Результат выполнения
подзапроса будет добавляться к каждой строке, как обычная колонка:

```sql
    select b.*,
           (select count(*) from book_orders) ord_cnt
    from books b
```

![](/img/8_subqueries/selectpart_1.png)

Здесь мы добавили колонку `ord_cnt`, которая содержит количество всех
имеющихся заказов по всем книгам.

Здесь также нельзя, чтобы запрос возвращал несколько колонок или
несколько строк. Зато запрос может ничего не возвращать, тогда значение
в колонке будет `NULL`:

```sql
    select b.*,
           (select book_id from book_orders where 2 > 10) book_id_subq
    from books b
```

![](/img/8_subqueries/selectpart_2.png)

Т.к. утверждение `2 > 10` ложно, подзапрос не вернет ни одной записи,
поэтому значение в соответствующей колонке будет `NULL`.

## Подзапросы во FROM части

Подзапросы можно использовать во FROM части запроса, и обращаться к
данным, которые они возвращают, как с полноценной таблицей(в пределах
запроса; каким-либо образом удалить или изменить данные в подрапросе не
получится).

```sql
    select b_orders.*
    from (
    select b.book_id, b.book_name, bo.quantity, bo.order_date
    from books b
    join book_orders bo on bo.book_id = b.book_id) b_orders
    where b_orders.quantity > 1
```

![](/img/8_subqueries/frompart_1.png)

Здесь мы написали отдельный запрос, дали ему псевдоним `b_orders`,
поместили его во `FROM` часть, как будто это обычная таблица, и дальше
работаем с псевдонимом данного подзапроса.

В подзапросе использовались [соединения](/sql/basics/joins/).

Сам подзапрос можно выполнить отдельно:

```sql
    select b.book_id, b.book_name, bo.quantity, bo.order_date
    from books b
    join book_orders bo on bo.book_id = b.book_id
```

![](/img/8_subqueries/frompart_2.png)

Как можно заметить, там есть строки, в которых количество(столбец
`quantity`) равен 1.

Но в первом примере этих строк нет, т.к. мы прописали условие
`where b_orders.quantity > 1`.

Подзапросов во `FROM` части может быть несколько, т.е. мы можем
соединять их, как обычные таблицы(опять, про соединения таблиц можно
почитать [вот здесь](/sql/basics/joins/).

В отличие от подзапросов, которые используются в select-части, данные
подзапросы могут возвращать более одной строки (более того, как правило,
они и возвращают много строк, иначе зачем их использовать?).

## Коррелированные подзапросы

Коррелированный подзапрос - это такой подзапрос, который использует для
своей работы данные из внешнего по отношению к нему запроса. Например:

```sql
    select b.*,
           (select count(*)
            from book_orders
            where book_id = b.book_id) ord_cnt
    from books b
```

![](/img/8_subqueries/correlated_select.png)

Здесь подзапрос подсчитывает количество дней, в которые производились
продажи определенной книги. Т.е. подзапрос считает количество строк в
таблице `book_orders` по значению колонки `book_id`, которую он берет из
внешнего запроса. В условии прописывается `where book_id = b.book_id`,
что означает: "Возьми для каждой строки из основного запроса значение
колонки book_id, и посчитай количество строк в таблице book_orders с
таким же book_id."

## Подзапросы в IN, NOT IN

Ранее уже рассматривались примеры и особенности использования `IN` и
`NOT IN` в SQL. В качестве перечисляемых значений в этих операторах были
значения, которые прописывал сам программист. На практике чаще всего в
качестве источника для значений в этих операторах используются
подзапросы:

```sql
    select b.*
    from books b
    where b.book_id in (
        select book_id
        from book_orders bo
        where bo.quantity < 2)
```

![](/img/8_subqueries/inpart_1.png)

Данный запрос выводит список книг, у которых были продажи менее, чем по
2 штуки в день.

Cписок книг для оператора `IN` формируется в результате выполнения
подзапроса, а не ручного кодирования значений программистом.

Подзапросы в `IN` и `NOT IN` должны возвращать строки с одной колонкой.
Следующий запрос выдаст ошибку `ORA-00913: too many values`, т.к.
подзапрос получает список строк с двумя колонками:

```sql
    select b.*
    from books b
    where b.book_id in (
        select book_id, quantity
        from book_orders bo
        where bo.quantity < 2)
```

При этом не следует забывать об особенности использования `NOT IN`: Если
в списке значений для проверки есть хотя бы одно `NULL`-значение, то
результат выражения будет ложным, и запрос не вернет никаких данных:

```sql
    select b.*
    from books b
    where b.book_id  not in (
        select book_id
        from book_orders bo
        where bo.quantity < 2

        union

        select null
        from dual)
```

![](/img/3_select/no_data_found.png)

Здесь при помощи [объединения](/sql/sets/unions/)
запросов в выборку
подзапроса была добавлена строка с одним `NULL`-значением, и как
следствие, запрос не вернул никаких данных.
