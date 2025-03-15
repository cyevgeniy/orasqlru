---
Title: "Изменение структуры таблицы. ALTER TABLE"
---

# Изменение структуры таблицы. `ALTER TABLE`


Уже созданные таблицы можно изменять. Для этого используется команда SQL
`ALTER`. Данная команда относится к группе DDL.

## Подготовка данных

Тестировать будем на таблице `employees`. Изначально она будет состоять
только из одной колонки `id`:

```sql
create table employees(
    id number not null primary key
);

insert into employees(id)
values(1);

insert into employees(id)
values(2);

insert into employees(id)
values(3);

insert into employees(id)
values(4);
```

## Добавление колонки в таблицу

Добавим в таблицу сотрудников колонку для хранения дня рождения:

```sql
alter table employees
add (birthday date)
```

По умолчанию все строки таблицы будут иметь `null` в новой колонке. Но
если при ее добавлении указать значение по-умолчанию, то все строки
будут содержать его в новой колонке.

Добавим колонку `notify_by_email`, которая будет по-умолчанию содержать
в себе "1", если сотруднику нужно отправлять уведомления по почте, и
"0", если нет:

```sql
alter table employees
add (
    notify_by_email number default 0
);

comment on column employees.notify_by_email is
'Уведомлять по почте(1-да, 0-нет)';
```

Посмотрим, как сейчас выглядят данные в таблице:

|ID| BIRTHDAY|NOTIFY_BY_EMAIL|
|-|-|-|
|1| -| 0|
|2|-|0|
|3|-|0|
|4|-|0|

Как видно, каждая строка содержит "0" в колонке `notify_by_email`.

Нельзя добавить колонку `NOT NULL` в таблицу с данными без значения
по-умолчанию.

```sql
-- Ошибка! Нельзя добавить колонку
-- без default-значения
alter table employees
add(
    not_null_col number(1) not null
)
```

В результате получим ошибку
`ORA-01758: table must be empty to add mandatory (NOT NULL) column`.

Но если указать значение по-умолчанию, ошибки не будет:

```sql
-- Ошибки не будет, каждая строка будет
-- содержать 1 в колонке
alter table employees
add(
    not_null_col number(1) default 1 not null    
)
```

Колонка добавляется без ошибок:

|ID| BIRTHDAY|NOTIFY_BY_EMAIL|NOT_NULL_COL|
|-|-|-|-|
|1| -| 0|1|
|2|-|0|1|
|3|-|0|1|
|4|-|0|1|

### Добавление нескольких колонок в таблицу

Чтобы добавить несколько колонок в таблицу, нужно просто перечислить их
через запятую:

```sql
alter table employees
add ( emp_lastname varchar2(100 char),
      emp_firstname varchar2(100 char),
      dept_id number(2) default 10 not null,
      is_out varchar2(1) default 'Y' not null);

comment on column employees.emp_lastname is
'Фамилия';

comment on column employees.emp_firstname is
'Имя';

comment on column employees.dept_id is
'id подразделения';

comment on column employees.is_out is
'Больше не работает?';
```

## Удаление колонки из таблицы

Удалим только что добавленную колонку `emp_lastname` из таблицы:

```sql
alter table employees
drop column emp_lastname
```

Следует учитывать, что если на удаляемую колонку ссылаются строки из
другой таблицы (посредством [внешнего ключа](/sql/dbobjects/foreignkeys/),
то удалить колонку не получится.

Убедимся в этом, создав таблицу `emp_bonuses`, которая будет ссылаться
на колонку `id` в таблице `employees`:

```sql
create table emp_bonuses(
    emp_id number not null,
    bonus number not null,
    constraint emp_bonuses_emp_fk
        foreign key(emp_id) references employees(id)
)
```

Теперь попробуем удалить колонку `id`:

```sql
    alter table employees
    drop column id
```

В результате мы получим ошибку
`ORA-12992: cannot drop parent key column`, которая говорит о том, что
удаляемая колонка является родительской для другой таблицы.

### Удаление нескольких колонок в таблице

Удалим колонки `emp_firstname` и `is_out` из таблицы:

```sql
alter table employees
drop (emp_firstname, is_out)
```

Удалять все колонки из таблицы нельзя, получим ошибку
`ORA-12983: cannot drop all columns in a table`.

### Логическое удаление колонок

Удаление колонок в очень больших таблицах может занять достаточно
большое количество времени. В таких случаях можно для начала пометить
нужные колонки как неиспользуемые:

```sql
alter table employees
set unused (emp_firstname, is_out)
```

После выполнения данной команды Oracle удалит эти колонки логически,
попросту пометив их как неиспользуемые. При запросе из таблицы они не
будут видны, и в таблицу можно даже добавлять колонки с такими же
названиями.

Чтобы удалить неиспользуемые колонки физически, используется следующий
запрос:

```sql
alter table employees
drop unused columns
```

Конечно, выполнять его желательно во время наименьшей нагрузки на
сервер.

## Переименование колонки

Переименуем колонку `birthday` в `bd`:

```sql
alter table employees
rename column birthday to bd
```

## Изменение типа данных колонки

Изменим тип колонки `dept_id` с числового на строковый:

```sql
alter table employees
modify(
    dept_id varchar2(10)
)
```

Здесь нужно обратить внимание на то, что при изменении типа мы не
добавляли `NOT NULL`. В `MODIFY` мы должны указать действия, которые
действительно что-то изменят. Колонка `dept_id` и так была `not null`, и
при изменении типа это свойство не нужно указывать.

Если попробовать добавить `not null`, получим ошибку
`ORA-01442: column to be modified to NOT NULL is already NOT NULL`:

```sql
alter table employees
modify(
    dept_id varchar2(10) not null -- получим ошибку
)
```

Следует учитывать одну важную деталь при изменении типа данных -
изменяемая колонка должна быть пуста.

Рассмотрим более подробно процесс изменения типа колонки, если в ней уже
содержатся данные.

Спустя какое-то время мы решили, что не хотим использовать числовое поле
для `boolean` значений. Вместо этого было решено использовать более
понятный строковый тип.

Для начала добавим колонку с нужным нам типом данных. Так как мы
не можем назвать ее `notify_by_email`(такая уже есть на данный момент),
то назовем ее `notify_by_email_new`:

```sql
alter table employees
add(
    notify_by_email_new varchar2(1)
     default 'N' not null
)
```

После этого нужно заполнить эту колонку данными. Алгоритм прост -
значение "1" в колонке `notify_by_email` должно быть перенесено как
значение "Y" в колонку `notify_by_email_new`, а значение "0" нужно
перенести в виде "N". Так как при добавлении колонки мы указали значение
по-умолчанию, то в таблице каждая строка содержит значение "N" в этой
колонке. Все, что осталось - это изменить значение на "Y", где
`notify_by_email` равен 1:

```sql
update employees e
set e.notify_by_email_new = 'Y'
where e.notify_by_email = 1
```

Затем удаляем колонку `notify_by_email`:

```sql
alter table employees
drop column notify_by_email
```

Теперь можно переименовать `notify_by_email_new` в `notify_by_email`:

```sql
alter table employees
rename column notify_by_email_new to
notify_by_email
```

Смотрим на результат:

|ID| BIRTHDAY|NOT_NULL_COL|dept_id|NOTIFY_BY_EMAIL|
|-|-|-|-|-|
|1|-|1|-|N|
|2|-|1|-|N|
|3|-|1|-|N|
|4|-|1|-|N|

## Изменение атрибута NOT NULL в колонке

Сделаем так, чтобы в колонку `dept_id` можно было сохранять `null`:

```sql
alter table employees
modify(dept_id null);
```

А теперь снова сделаем ее `NOT NULL`:

```sql
alter table employees
modify(dept_id not null);
```

::: warning
Нельзя изменить колонку на NOT NULL, если в ней уже содержатся
NULL-значения.
:::

## Переименование таблицы

Следующий запрос переименует таблицу `employees` в `emps`:

```sql
rename employees to emps
```

Переименование таблицы не приводит к ошибке при
наличии ссылок на нее. В нашем примере таблица успешно переименуется,
несмотря на дочернюю таблицу `emp_bonuses`. Внешний ключ при этом никуда
не исчезает - в таблицу `emp_bonuses` по-прежнему нельзя добавить
значения, нарушающие условия внешнего ключа.
