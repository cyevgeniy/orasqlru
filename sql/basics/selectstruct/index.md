---
Title: "Пример SELECT запроса. Порядок выполнения"
---

# Пример SELECT запроса. Порядок выполнения

Рассмотрим простой SQL запрос:

```sql
-- данные, которые мы извлекаем
select emp.name,
       emp.last_name,
       emp.age,
       dept.name
from employees emp
join departments dept on dept.id = emp.department_id -- соединение
where (emp.id = 10 and emp.age > 25) -- условие выборки
order by name desc -- сортировка
```

Конечно, запрос может выглядеть и по-другому, но в целом данный пример
раскрывает большую часть из структуры SELECT запроса.

## Порядок выполнения SQL запросов

Очень важно понимать, в каком порядке выполняется запрос.

1. Сначала БД должна определить весь набор данных, из которого будет производиться выборка. Для этого выполняется всё, что указано во `FROM`. Если имеются соединения таблиц ([`JOIN`](/sql/basics/joins/)), они также выполняются.
2. Отлично, БД определила весь набор данных, с которым ей придется иметь дело. Теперь нужно отсеять ненужное. Для этого выполняются все проверки, указанные в [`WHERE`](/sql/basics/comparison/). Эти проверки выполняются для каждой строки и те их них, которые не подходят под условие, отбрасываются.
3. Теперь, если в запросе задана группировка ([`GROUP BY`](/sql/standfunc/aggregation/)), оставшиеся строки группируются по заданному условию.
4. Если использовалась группировка, производится проверка, заданная через `HAVING`. Опять, все строки, которые не подходят под условие, отбрасываются.
5. Выполняется `SELECT`. Все выражения, указанные в нем, выполняются для каждой строки.
6. Все строки с дубликатами колонок, отмеченных как `DISTINCT`, удаляются
7. Полученные данные сортируются в указанном порядке ([`ORDER BY`](/sql/basics/orderby/))

Сейчас это может показаться не столь важным, но знания о порядке
выполнения запроса пригодятся, когда мы будем рассматривать запросы с
использованием псевдостолбца [`ROWNUM`](/sql/dbobjects/pseudocolumns/#rownum).
