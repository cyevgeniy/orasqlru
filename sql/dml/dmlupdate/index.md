---
Title: "Изменение данных. UPDATE"
---

# Изменение данных. `UPDATE`

Данный оператор изменяет уже существующие данные в таблице.

Общий синтаксис выглядит следующим образом:

```
UPDATE table_1 t
SET t.column_1 = val_1,
    t.columm_2 = val_2
WHERE <condition>
```

При обновлении можно ссылаться на текущие значения в таблице. Например,
увеличим возраст всех сотрудников на 1 год:

```sql
update employees emp
set emp.age = emp.age + 1
```

Можно добавлять любые условия в `where`, как и в select-запросах, чтобы
обновить не все строки в таблице, а только те, которые удовлетворяют
определенным условиям:

```sql
-- Увеличить возраст сотруднику с именем Антон Иванов
update employees emp
set emp.age = emp.age + 1
where emp.name = 'Антон Иванов';
```

```sql
-- Увеличить возраст сотруднику с id = 10 и привести имя к верхнему регистру
update employees emp
set emp.age = emp.age + 1,
    emp.name = upper(emp.name)
where emp.id = 10;
```

При обновлении мы можем использовать подзапросы для получения новых
значений:

```sql
update employees emp
-- для каждого сотрудника получаем возраст из таблицы страховой карточки
-- и присваиваем это значение в колонку age таблицы employees
set emp.age = (select age from insurance_card ic where ic.emp_id = emp.id)
where emp.age is null
```

В данном случае использовался [коррелированный подзапроса](/sql/basics/subqueries/), чтобы получить
возраст сотрудника из его страховой карточки.

С использованием подзапросов можно обновлять сразу несколько колонок в
таблице:

```sql
update employees emp
set(
    emp.age,
    emp.passport_no
) = (select ic.age, ic.passport_no from insurance_card ic
     where ic.emp_id = emp.id)
```

Подобное обновление сразу нескольких колонок работает только с
подзапросами, вручную установить значения не получится:

```sql
-- Получим ошибку!
update employees emp
set(
    emp.age,
    emp.passport_no
) = (20, '324589')
```

В результате получим ошибку
`ORA-01767: UPDATE ... SET expression must be a subquery`.

Но зато можно вот так:

```sql
update employees emp
set(
    emp.age,
    emp.passport_no
) = (select 20, '324589' from dual)
```

::: info
Последний запрос более демонстрационный, если нужно обновить несколько
колонок заранее известными константами, то лучше прибегнуть к
"классическому" варианту обновления таблицы - так запрос будет проще
читаться.
:::
