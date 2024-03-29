---
Title: "Внешние ключи"
---

# Внешние ключи

Рассмотрим пример из части про
[первичные ключи](/sql/dbobjects/primarykeys/).

У нас было две таблицы - список сотрудников и единовременные бонусы для
них. С помощью первичного ключа в таблице сотрудников мы решили проблему
соотношения между бонусами и сотрудниками.

Схематично наши таблицы выглядят вот так:

![](/img/13_relations/foreign_key_problem_1.png)

Благодаря наличию первичного ключа мы однозначно можем сказать, какому
сотруднику какой бонус начисляется.

А теперь посмотрим на следующую ситуацию: в таблицу `bonuses`
добавляется запись со значением `emp_id`, которому нет соответствия в
таблице сотрудников.

![](/img/13_relations/fk_problem_2.png)

Как такое может быть? Мы начисляем бонусы сотруднику, которого у нас
нет! Если нас попросят сказать, на какую сумму было выдано
единовременных бонусов, или сколько их было выдано, то мы не сможем
ответить, т.к. не будем уверены, что данные в таблице с бонусами вообще
корректны.

Так вот, внешние ключи используются как для решения подобной проблемы.

Внешние ключи используются для того, чтобы указать, что данные в
колонках одной таблицы могут содержать только определенные значения из
другой таблицы.

В отличие от первичного ключа, значение внешнего не обязано быть
уникальным. Более того, оно даже может содержать `NULL`. Главное
требование - это наличие значения внешнего ключа в ссылаемой таблице.

## Создание внешних ключей

Общий синтаксис следующий:

```sql
create table detail(
    master_id number,
    value_1 number,
    value_2 number,
    -- Внешний ключ из таблицы detail к таблице master
    constraint detail_master_id_fk
        foreign key(master_id)
        references master(id)
);
```

Здесь `detail_master_id_fk` - название внешнего ключа.

Также, как и у первичных ключей, длина имени внешнего ключа ограничена
30 символами.

У внешних ключей есть еще одна особенность - они могут ссылаться только
на первичные или уникальные ключи. Если попытаться создать внешний ключ,
который будет ссылаться на колонку, которая не является первичным или
уникальным ключом БД выдаст ошибку.

Попробуем создать наши таблицы из примера:

```sql
create table employees(
    id number primary key,
    emp_name varchar2(100 char) not null,
    department varchar2(50 char) not null,
    position varchar2(50 char) not null
);

create table bonuses(
    emp_id number not null,
    bonus number not null,
    constraint bonuses_emp_id_fk
        foreign key(emp_id)
        references employees(id)
);
```

В данном случае таблица `bonuses` является дочерней по отношению к
таблице `employees`, т.к. содержит внешний ключ, который ссылается из
`bonuses` на `employees`.

После этого заполним данными эти таблицы:

```sql
-- Сначала добавляем сотрудников

insert into employees(id, emp_name, department, position)
values(1, 'Иван Петров', 'IT', 'QA');

insert into employees(id, emp_name, department, position)
values(2, 'Алексей Иванов', 'SALARY', 'CLERK');

insert into employees(id, emp_name, department, position)
values(3, 'Евгений Сидоров', 'SALARY', 'MANAGER');

insert into employees(id, emp_name, department, position)
values(4, 'Екатерина Петрова', 'SECUTIRY', 'MANAGER');

-- После - бонусы для них

insert into bonuses(emp_id, bonus)
values(1, 100);

insert into bonuses(emp_id, bonus)
values(2, 400);

insert into bonuses(emp_id, bonus)
values(3, 700);
```

Порядок добавления данных в таблицы важен: нельзя сначала добавить новые
данные в таблицу `bonuses`, а потом в таблицу `employees`, т.к. попытка
добавить бонус для сотрудника, которого еще нет в таблице `employees`
приведет к ошибке из-за наличия внешнего ключа.

```sql
-- Вот так будет ошибка, т.к. сотрудник с id = 5
-- еще не добавлен в таблицу employees
insert into bonuses(emp_id, bonus)
values(5, 500);

-- А вот так ошибки не будет
-- Сотрудник с id = 4 уже есть в таблице сотрудников
insert into bonuses(emp_id, bonus)
values(4, 500);
```
