---
title: "Пересечение запросов"
---

# Пересечение запросов

В качестве тестовых данных будем использовать таблицы из примера про
[разность запросов](/sql/sets/minus/).

Для получения пересечения данных между двумя запросами используется
оператор `INTERSECT`. Он возвращает уникальные строки, которые
присутствуют как в первом, так и во втором запросе.

Ограничения при использовании `INTERSECT` такие же, как и при
использовании `UNION` и `MINUS`:

-   Оба запроса должны возвращать одинаковое количество колонок
-   Типы данных в колонках должны совпадать.

Получим список моделей автомобилей, которые есть и в автопарке, и в
списке предлагаемых для покупки моделей:

```sql
select car_model, release_year
from cars

INTERSECT

select car_model, release_year
from car_offers
```

![](/img/7_unions/intersect_1.png)

Как и в случае с `MINUS`, `INTERSECT` убрал дубликаты и оставил только
одну модель авто, которая встречается и в таблице `cars`(2 раза), и в
таблице `car_offers`(1 раз).
