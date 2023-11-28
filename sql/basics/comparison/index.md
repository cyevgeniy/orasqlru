---
Title: "Оператор WHERE. Операторы сравнения"
---

# Оператор WHERE. Операторы сравнения

Использование оператора `where` позволяет добавить фильтр на те данные,
которые будет обрабатывать sql, будь то выборка, вставка, обновление или
удаление.

Для демонстрации будем использовать те же данные, что и в примере с
[order by](../orderby/index.html) :

```sql
create table dishes(
name varchar2(100) not null,
price number(5,2) not null,
rating number(5)
);

comment on column dishes.name is
    'Наименование блюда';
comment on column dishes.price is
    'Стоимость за одну порцию';
comment on column dishes.rating is
    'Популярность блюда';

insert into dishes(name, price, rating)
values ('Макароны с сыром', 20.56, 320);

insert into dishes(name, price, rating)
values ('Борщ', 10, 130);

insert into dishes(name, price, rating)
values ('Чай с лимоном', 1.34, 270);

insert into dishes(name, price, rating)
values ('Чай с молоком', 1.20, 280);

insert into dishes(name, price, rating)
values ('Свиная отбивная', 30.50, 320);

insert into dishes(name, price, rating)
values ('Овощной салат', 5.70, null);
```

## Операторы сравнения

В `where` можно использовать следующие реляционные операторы:

    <, >, <=, >=, !=, <>

Последние 2 оператора обозначают одно и то же - "Не равно".

Рассмотрим применение данных операторов на примерах.

### Оператор "Меньше"(\<)

```sql
select d.*
from dishes d
where d.rating < 320
```

Данный запрос вернет список всех блюд, рейтинг которых меньше, чем 320:

![](/img/3_select/rating_less_320.png)

### Оператор "Больше"(>)

```sql
select d.*
from dishes d
where d.rating > 270
```

Данный запрос вернет список блюд с рейтингом, большим, чем 270:

![](/img/3_select/rating_greater_270.png)

### Оператор "Больше либо равно"(≥)

```sql
select d.*
from dishes d
where d.rating >= 270
```

Данный запрос вернет список блюд с рейтингом, большим либо равным 270:

![](/img/3_select/rating_greaterequal_270.png)

### Оператор "Меньше либо равно"(≤)

```sql
select d.*
from dishes d
where d.rating ≤ 320
```

Данный запрос возвращает все блюда, рейтинг которых меньше либо равен
320:

![](/img/3_select/rating_lessequal_320.png)
