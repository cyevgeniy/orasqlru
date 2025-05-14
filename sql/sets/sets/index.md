---
Title: "Работа с множествами. Общая информация"
---

# Работа с множествами. Общая информация

## Следить за порядком колонок

При использовании операторов `UNION`, `MINUS` и `INTERSECT` нужно внимательно
следить за порядком колонок в каждом из запросов, ведь несоблюдение
порядка следования приведет к некорректным результатам.

Как было рассмотрено, Oracle будет проверять, чтобы тип колонок в каждом
из запросов совпадал, но проверять, правильно ли расположены колонки
одного типа, он не будет (потому что не сможет).

```sql
select car_model model, car_id release_year
from cars

minus

select car_model, release_year
from car_offers
```

|MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 4 | 
| Mersedes SL | 3 | 
| Mersedes SL | 5 | 
| Volkswagen passat | 1 | 
| Volkswagen passat | 2 | 


В запросе выше, в первой его части, вместо колонки `release_year` по
ошибке была указана колонка `car_id`. Так как обе имеют числовой тип,
ошибки не возникло, но данные на выходе получились ошибочными.

::: warning
Следует внимательно следить за порядком колонок в каждом из запросов при
использовании операторов для работы с множествами.
:::

## Сортировка

`ORDER BY` добавляется в конце запроса, и применяется к уже
получившемуся в результате выполнения оператора множества набору данных.

Следующий запрос вернет список авто из имеющихся у нас, но
отсутствующих в списке предлагаемых моделей, и отсортирует итоговую
выборку по возрастанию года выпуска:

```sql
select car_model, release_year
from cars

minus

select car_model, release_year a2
from car_offers
order by release_year
```

Использовать сортировку в первом запросе нельзя, получим ошибку
`ORA-00933: SQL command not properly ended`:

```sql
-- Ошибка!
select car_model, release_year
from cars
order by release_year

minus

select car_model, release_year
from car_offers
```

Как и в случае с обычными запросами, сортировать можно по порядковому
номеру колонки итоговой выборки:

```sql
select car_model, release_year
from cars

minus

select car_model, release_year a2
from car_offers
-- Сортировка по модели авто
order by 1 desc
```

## Приоритет выполнения

Между собой операторы множества имеют одинаковый приоритет. Если в
запросе используется несколько таких операторов, то они выполняются
последовательно.

```sql
select car_model, release_year
from cars

minus

select car_model, release_year
from car_offers

union all

select car_model, release_year
from cars
```

| CAR_MODEL | RELEASE_YEAR |
|-|-|
| Lexus S300 | 2005 | 
| Mersedes SL | 2008 | 
| Mersedes SL | 2010 | 
| Volkswagen passat | 1998 | 
| Volkswagen passat | 1998 | 
| Mersedes SL | 2010 | 
| Lexus S300 | 2005 | 
| Mersedes SL | 2008 | 





В данном примере сначала был выполнен оператор `MINUS`, и уже после к
полученному результату был применен оператор `UNION ALL`.

Чтобы изменить порядок выполнения операторов, используются скобки:

```sql
select car_model, release_year
from cars

minus

-- minus будет применен
-- к результату выполнения
-- UNION ALL
(select car_model, release_year
from car_offers

UNION ALL

select car_model, release_year
from cars)
```

Здесь оператор `MINUS` будет применяться к набору данных, который
получится в результате выполнения `UNION ALL`.
