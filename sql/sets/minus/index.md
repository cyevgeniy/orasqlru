---
title: "Разница запросов. MINUS"
---

# Разница запросов. `MINUS`

Подготовим тестовые данные:

```sql
create table cars(
    car_id number not null,
    car_model varchar2(100) not null,
    release_year number
);

create table car_offers(
    car_model varchar2(100) not null,
    release_year number
);

insert into cars
values(1, 'Volkswagen passat', 1998);

insert into cars
values(2, 'Volkswagen passat', 1998);

insert into cars
values(3, 'Mersedes SL', 2010);

insert into cars
values(4, 'Lexus S300', 2005);

insert into cars
values(5, 'Mersedes SL', 2008);

insert into car_offers
values('Lexus S300', 2010);

insert into car_offers
values('Tesla', 2017);

insert into car_offers
values('Volkswagen passat', 1998);

insert into car_offers
values('Volkswagen passat', 2003);
```

Посмотрим на данные в таблицах:

Таблица `cars`

![](/img/7_unions/minus_cars.png)

Таблица `car_offers`

![](/img/7_unions/minus_car_offers.png)

Получим список предлагаемых нам моделей автомобилей, которых нет среди
нашего автопарка. Для этого будем использовать оператор `MINUS`, который
возвращает уникальные строки из первого запроса, которых нет во втором
запросе:

```sql
select car_model
from car_offers

MINUS

select car_model
from cars
```

![](/img/7_unions/minus_car_model_result.png)

Если искать только отсутствующие у нас марки авто, то найдется лишь одна
модель, которой нет у нас - "Tesla".

Теперь получим предложения автомобилей, у которых либо год, либо модель
не совпадают с теми авто, что есть у нас:

```sql
select car_model, release_year
from car_offers

MINUS

select car_model, release_year
from cars
```

![](/img/7_unions/minus_car_model_year_result.png)

Типы данных в колонках и их количество в каждом из запросов должны
совпадать.

Если мы в первом запросе поменяем местами колонки, то запрос не
выполнится и мы получим ошибку
`ORA-01790: expression must have same datatype as corresponding expression`:

```sql
-- Ошибка, типы данных возвращаемых колонок  в
-- обоих запросах должны совпадать
select release_year, car_model
from car_offers

MINUS

select car_model, release_year
from cars
```

Если запросы возвращают неодинаковое количество колонок, при выполнении
запроса получим ошибку
`ORA-01789: query block has incorrect number of result columns`:

```sql
-- Ошибка, запросы должны возвращать
-- одинаковое количество колонок
select release_year
from car_offers

MINUS

select car_model, release_year
from cars
```

::: info
MINUS возвращает уникальные строки, которые отсутствуют во втором
запросе.
:::

Разберем это на примере. Для начала удалим из таблицы `car_offers`
модели Volkswagen passat:

```sql
delete
from car_offers
where car_model = 'Volkswagen passat'
```

Теперь данные в таблице `car_offers` выглядят вот так:

![](/img/7_unions/minus_car_offers_without_passat.png)

Теперь получим список моделей авто, которые есть у нас, но отсутствуют в
списке предложений:

```sql
select car_model, release_year
from cars

MINUS

select car_model, release_year
from car_offers
```

![](/img/7_unions/minus_unique_passat.png)

В результате мы видим всего одну строку с моделью Volkswagen passat 1998
года, несмотря на то, что в таблице `cars` таких записей две. Как было
сказано, это произошло потому, что оператор `MINUS` удаляет дубликаты и
возвращает только уникальные строки.
