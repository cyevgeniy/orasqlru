---
title: "Exists. Наличие строк в подзапросе"
---

# `Exists`. Наличие строк в подзапросе

Оператор `EXISTS` имеет вид `EXISTS(подзапрос)`, и возвращает истинное значение
в том случае, если подзапрос в скобках возвращает хотя
бы одну строку. Может использоваться с оператором `NOT`.

Примеры будем разбирать на данных из части про [подзапросы](/sql/basics/subqueries/).

**Пример №1:**  Получить список книг, которые заказывались хотя бы раз.

Очевидно что ответом будут те книги, ссылки на которые есть в
таблице `book_orders`. Нас устроит любая книга, которая имеет
хотя бы один заказ, и поэтому  задача легко решается с использованием `EXISTS`:

```sql
select *
from books b
where exists(
    select null
    from book_orders bo where bo.book_id = b.book_id
)
```

|BOOK_ID| BOOK_NAME | AUTHOR | RELEASE_YEAR|
|-|-|-|-|
|1| Властелин колец| Толкин | 1954|
|2|Гордость и предубеждение|Джейн Остин|1813|
|3|Тёмные начала|Филип Пулман|1995|

Здесь использовался коррелированный подзапрос, который проверяет
наличие данных в таблице с заказами. Подзапрос может быть любым,
и он не обязан быть коррелированным. Все, что проверяет
`EXISTS` — это то, вернул ли подзапрос какие-либо данные, или нет.

Следует обратить внимание на то, что мы не указываем наименования
колонок в подзапросе, так как сами данные нам не интересны — нас
интересует лишь факт наличия данных, которые возвращает подзапрос.

Следующий запрос идентичен предыдущему:

```sql
select *
from books b
where exists(
    select bo.book_id, bo.quantity
    from book_orders bo where bo.book_id = b.book_id
)
```

Только здесь нет смысла в получении колонок
`book_id` и `quantity`, так как они никак не будут использованы.

**Пример №2**: Получить список книг, которые ни разу не покупали.

Решение здесь прямо обратное предыдущему — нас интересуют такие книги, на которы из таблицы с заказами нет ссылок:

```sql
select *
from books b
where not exists(
    select null
    from book_orders bo where bo.book_id = b.book_id
)
```

|BOOK_ID| BOOK_NAME | AUTHOR | RELEASE_YEAR|
|-|-|-|-|
|4|Автостопом по галактике|Дуглас Адамс|1979|
