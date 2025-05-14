---
title: "Разница запросов. MINUS"
---

# Разница запросов. `MINUS`

Подготовим тестовые данные:

```sql
-- Список автомобилей, которые имеются в нашем автопарке
create table cars(
    car_id number not null,
    car_model varchar2(100) not null,
    release_year number
);

-- Список автомобилей, доступных для закупки
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


|CAR_ID| CAR_MODEL | RELEASE_YEAR |
|-|-|-|
|1| Volkswagen passat | 1998 | 
|2| Volkswagen passat | 1998 | 
|3| Mersedes SL | 2010 | 
|4| Lexus S300 | 2005 | 
|5| Mersedes SL | 2008 | 

Таблица `car_offers`

| CAR_MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 2010 | 
| Tesla | 2017 | 
| Volkswagen passat | 1998 | 
| Volkswagen passat | 2003 | 


Получим список предлагаемых нам моделей автомобилей, которых нет среди автопарка. Для этого будем использовать оператор `MINUS`, который
возвращает **уникальные строки из первого запроса, которых нет во втором
запросе**:

```sql
select car_model
from car_offers

MINUS

select car_model
from cars
```

|CAR_MODEL|
|-|
| Tesla |

Итак, в нашем автопарке отсутствует лишь одна модель - "Tesla".

Теперь получим предложения автомобилей, у которых либо год, либо модель
не совпадают с теми авто, что есть у нас:

```sql
select car_model, release_year
from car_offers

MINUS

select car_model, release_year
from cars
```

| CAR_MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 2010 | 
| Tesla | 2017 | 
| Volkswagen passat | 2003 | 

:::warning
Типы данных в колонках и их количество в каждом из запросов должны
совпадать.
:::

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

| CAR_MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 2010 | 
| Tesla | 2017 | 

Теперь получим список моделей авто, которые есть у нас, но отсутствуют в
списке предложений:

```sql
select car_model, release_year
from cars

MINUS

select car_model, release_year
from car_offers
```

| CAR_MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 2010 | 
| Mersedes SL | 2008 | 
| Mersedes SL | 2010 | 
| Volkswagen passat | 1998 | 

Обратите внимание, что в результате мы видим всего одну строку с моделью *Volkswagen passat 1998
года*, несмотря на то, что в таблице `cars` таких записей две. Это произошло потому, что оператор `MINUS` **удаляет дубликаты и
возвращает только уникальные строки**.
