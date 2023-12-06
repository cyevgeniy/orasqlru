---
Title: "Представления(views)"
weight: 4
toc: true
---

# Представления(Views)

Представления(Views) - это такой объект в БД, который:

1.  Выглядит как таблица
2.  Внутри себя содержит SQL запрос, которым заменяется таблица при
    обращении к ней.

Во многом представления работают также, как и обычные таблицы. В них
можно(правда с определенными ограничениями) вставлять, изменять и
удалять данные.

## Создание представлений

Общий синтаксис создания представления следующий:

    create view viewname as
    select ...
    ....
    ....;

Т.е. для создания представления достаточно написать запрос, который
возвращать нужные данные.

Можно создавать представления с опцией `or replace`, тогда в том случае,
если такое представление уже существует, оно будет заменено на новое.

    create or replace view viewname as
    select ...
    ....
    ...;

Создадим таблицу с сотрудниками, должностями и подразделениями:

```sql
create table employees(
    id number,
    emp_name varchar2(100 char),
    dept_id number,
    position_id number
);

create table departments(
    id number,
    dept_name varchar2(100)
);

create table positions(
    id number,
    position_name varchar2(100)
);

insert into departments values(1, 'IT');
insert into departments values(2, 'SALARY');

insert into positions values(1, 'MANAGER');
insert into positions values(2, 'CLERK');

insert into employees values(1, 'Иван Петров', 1, 1);
insert into employees values(2, 'Петр Иванов', 1, 2);
insert into employees values(3, 'Елизавета Сидорова', 2, 1);
insert into employees values(4, 'Алексей Иванов', 2, 2);
```

Создадим представление `vemployees`, которое будет выводить данные по
сотрудникам в уже "соединенном" виде:

```sql
create view vemployees as
select e.id,
       e.emp_name,
       d.dept_name,
       p.position_name
from employees e
join departments d on d.id = e.dept_id
join positions p on p.id = e.position_id;

comment on table vemployees is 'сотрудники';
comment on column vemployees.id is 'id сотрудника';
comment on column vemployees.emp_name is 'имя сотрудника';
comment on column vemployees.dept_name is 'подразделение';
comment on column vemployees.position_name is 'должность';
```

Следует обратить внимание на то, что представлениям и колонкам в них
можно задавать комментарии как и обычным таблицам.

Теперь, чтобы получить нужные нам данные, нам не нужно заново писать
запрос, достаточно сразу выбрать данные из представления:

```sql
select *
from vemployees
```

![](/img/14_views/vemployees.png)

При создании представлений можно использовать уже существующие
представления:

```sql
create view vemployees_it as
select a.*
from vemployees a
where a.dept_name = 'IT';
```

Следует с осторожностью использовать уже созданные представления при
создании других представлений. Может случиться так, что написать новый
запрос будет куда лучше, чем использовать существующие, но не полностью
подходящие.

### Символ \* при создании представлений

Когда при создании представления используется символ "\*", то Oracle
заменяет звездочку на список столбцов. Это означает, что если в таблицу
будет добавлена новая колонка, то она не будет автоматически добавлена в
представление.

Это очень просто проверить:

```sql
create table tst(
    n1 number,
    n2 number
);

insert into tst values(1, 2);

create view v_tst as
select *
from tst;
```

Посмотрим, какие данные содержатся в представлении:

```sql
select *
from v_tst
```

![](/img/14_views/view_asterics_1.png)

Теперь добавим в таблицу `tst` еще одну колонку( изменение таблиц будет
рассматриваться позже, сейчас достаточно понимать, что данный запрос
добавляет новую колонку в таблицу):

```sql
alter table tst
add (n3 number);
```

Если сейчас получить все данные из представления, мы увидим, что список
колонок в ней не изменился:

![](/img/14_views/view_asterics_1.png)

Чтобы добавить колонку "n3" в представление, можно изменить его, добавив
в список колонок нужную, либо заново создать(с использованием
`create or replace`):

```sql
create or replace view v_tst as
select *
from tst
```

## Изменение данных представления

Таблицы, которые используются в запросе представления, называются
*базовыми таблицами*.

Представления, которые созданы на основании одной базовой таблицы, можно
изменять также, как и обычную таблицу.

Например, создадим представление `vdepartments` и добавим в него
несколько записей.

```sql
-- создаем представление
create view vdepartments as
select id, dept_name
from departments;

-- добавляем данные через представление, а не таблицу
insert into vdepartments(id, dept_name)
values(10, 'SALES');
```

Конечно, фактически данные добавляются не в представление, а в базовую
таблицу(в данном случае `departments`):

```sql
select *
from departments
```

![](/img/14_views/departments_all.png)

Строки можно и удалять, а также и изменять:

```sql
delete from vdepartments
where id = 10;

update vdepartments
set dept_name = 'SECURITY'
where id = 1;
```

Посмотрим на результаты:

```sql
select *
from vdepartments
```

![](/img/14_views/vdepartments.png)

### Представления с проверкой (WITH CHECK OPTION)

Можно создавать представления, которые будут ограничивать изменение
данных в базовых таблицах. Для этого используется опция
`WITH CHECK OPTION` при создании представления.

Создадим представление, которое содержит в себе только менеджеров:

```sql
create view vemp_managers as
select *
from employees
where position_id = 1;
```

Данное представление содержит только менеджеров, но это не означает, что
в него нельзя добавить сотрудников других профессий:

```sql
-- Добавим сотрудника c position_id = 2
insert into vemp_managers(id, emp_name, dept_id, position_id)
values(10, 'Иван Иванов', 1, 2);
```

Данные в представлении остались те же, что и были:

```sql
select *
from vemp_managers
```

![](/img/14_views/vemp_managers.png)

А вот в таблицу `employees` был добавлен новый сотрудник Иван Иванов:

```sql
select *
from employees
where id = 10
```

![](/img/14_views/employees_id_10.png)

Для того, чтобы через представление можно было изменять только те
данные, которые в нем содержатся(а точнее, которые можно получить через
представление), при его создании следует указать опцию
`WITH CHECK OPTION`.

Создадим заново представление `vemp_managers`, только с добавлением
`with check option`, и попробуем снова добавить в него запись:

```sql
create or replace view vemp_managers as
select *
from employees
where position_id = 1
with check option;

-- Попробуем добавить запись с position_id = 2
insert into vemp_managers(id, emp_name, dept_id, position_id)
values(11, 'Иван Иванов Второй', 1, 2);
```

При попытке это сделать, мы получим ошибку
`view WITH CHECK OPTION where-clause violation`.

Но зато добавить сотрудника с `position_id = 1` можно без проблем:

```sql
-- Запись успешно добавится в таблицу employees
insert into vemp_managers(id, emp_name, dept_id, position_id)
values(11, 'Иван Иванов Второй', 1, 1);
```

### Изменение представлений из нескольких таблиц

В Oracle можно изменять данные через представления, которые получают
данные из нескольких таблиц.

Но есть определенные ограничения:

1.  Изменять можно данные только одной базовой таблицы
2.  Изменяемая таблица должна быть т.н. "key preserved table" (таблица с
    сохранением ключа).

Второй пункт возможно самый важный для понимания того, можно ли изменять
данные в представлении из нескольких таблиц или нет.

Так вот, таблица называется key preserved, если каждой ее строке
соответствует *максимум одна строка* в представлении.

::: info
Следует помнить, что свойство сохранения ключа в представлениях не
зависит от данных, а скорее от структуры таблиц и их отношений между
собой. Фактически в представлении данные могут выглядеть так, что для
одной строки базовой таблицы есть лишь одна строка представления, но это
не означает, что этот вид не изменится при изменении данных в таблицах
представления.
:::

Для примера создадим представление `vemp_depts`, которое будет содержать
информацию о сотрудниках и подразделениях, в которых они работают:

```sql
create or replace view vemp_depts as
select e.id,
       e.emp_name,
       e.dept_id,
       e.position_id,
       d.id department_id,
       d.dept_name
from employees e
join departments d on e.dept_id = d.id
```

Посмотрим, какие данные там находятся:

```sql
select *
from vemp_depts
```

![](/img/14_views/vemp_depts_1.png)

Как мы видим, каждая строка из базовой таблицы `employees` встречается в
представлении всего один раз. Попробуем добавить нового сотрудника через
это представление:

```sql
insert into vemp_depts(id, emp_name, dept_id, position_id)
values(20, 'Иван Василенко', 1, 1);
```

В результате получаем ошибку
`cannot modify a column which maps to a non key-preserved table`,
которая говорит о том, что таблица не обладает нужными свойствами для
обновления через представление.

Зная, что проблему нужно искать не в самих данных, а в схеме БД,
посмотрим, как мы создавали наши таблицы и как выглядит наш запрос в
представлении.

```sql
select e.id,
       e.emp_name,
       e.dept_id,
       e.position_id,
       d.id department_id,
d.dept_name
from employees e
join departments d on e.dept_id = d.id
```

Здесь мы берем каждую строку из таблицы `employees` и соединяем с
таблицей `departments` по полю `dept_id`. В каком случае может произойти
так, что в представлении для одной строки из таблицы `employees`
окажутся 2 строки после соединения с таблицей `departments`? Правильно,
в том случае, если в таблице `departments` будут 2 строки с одинаковым
значением в колонке `id`. Сейчас таких данных в таблице нет, но это не
означает, что они не могут появиться. Посмотрим, как мы создавали
таблицу `departments`:

```sql
create table departments(
    id number,
    dept_name varchar2(100)
);
```

Как видно, нет никаких ограничений на колонку `id`. Но мы можем сделать
ее уникальной, добавив [первичный](../primarykeys/index.html) или
[уникальный ключ](../uniquekeys/index.html).

```sql
alter table departments
add (
    constraint departments_pk primary key(id)
);
```

Теперь снова попробуем добавить нового сотрудника:

```sql
-- Запись будет добавлена без ошибок
insert into vemp_depts(id, emp_name, dept_id, position_id)
values(20, 'Иван Василенко', 1, 1);
```

Добавить данные в таблицу `departments` через это представление не
получится:

```sql
--  cannot modify a column which maps to a non key-preserved table
insert into vemp_depts(department_id, dept_name)
values(7, 'HEAD DEPARTMENT');
```

Причина здесь та же: нельзя гарантировать, что в таблице `employees`
каждый сотрудник имеет уникальное значение `dept_id`.

### Ограничения в изменяемых представлениях

Изменения в представлениях возможны не всегда. Есть определенные
условия, при которых они запрещены:

1.  Наличие в представлении агрегатных функций, конструкции `group by`,
    оператора `distinct`, операторов для работы с множествами(`union`,
    `union all`, `minus`).
2.  Если данные не будут удовлетворять условию, прописанному в опции
    `WITH CHECK OPTION`.
3.  Если колонка в базовой таблице `NOT NULL`, не имеет значения
    по-умолчанию, и отсутствует в представлении.
4.  Если колонки в представлении представляют собой выражения (Например
    что-то вроде `nvl(a.value, -1)`).

### Запрет изменения представления

Чтобы создать представление, которое нельзя будет изменять, нужно
создать его с опцией `with read only`.

Пересоздадим представление `vdepartments` и попробуем добавить туда
данные:

```sql
create or replace view vdepartments as
select id, dept_name
from departments
with read only;

-- Попробуем добавить данные
insert into vdepartments(id, dept_name)
values(11, 'SECURITY');
```

В результате получим ошибку
`cannot perform a DML operation on a read-only view`.
