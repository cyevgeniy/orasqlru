---
Title: "Функции для работы с NULL"
---

# Функции для работы с NULL

Так как `NULL` - особое значение, то он удостоился отдельных функций в
Oracle, которые умеют работать с ним "из коробки".

## Подготовка тестовых данных

Работать будем со следующей таблицей:

```sql
create table profiles(
    login varchar2(30) primary key,
    last_updated date,
    status varchar2(50)
);

comment on table profiles is 'Профили форума';
comment on column profiles.last_updated is 'Дата последнего обновления';
comment on column profiles.status is 'Статус';

insert into profiles(login, last_updated, status)
values ('johndoe', to_date('01.01.2009 23:40', 'dd.mm.yyyy hh24:mi'), '');

insert into profiles(login, last_updated, status)
values ('admin', to_date('01.01.2019 21:03', 'dd.mm.yyyy hh24:mi'), 'Я админ. Все вопросы ко мне');

insert into profiles(login, last_updated, status)
values ('alisa', null, 'Окажу помощь в проектировании домов');

insert into profiles(login, last_updated, status)
values ('nelsol', null, null);
```

## Nvl

```sql
select nvl(2, 10) nvl_1,
nvl(null, 20) nvl_2
from dual
```

Данная функция принимает 2 параметра. Если первый параметр равен `NULL`,
то будет возвращен второй параметр. В противном случае функция вернет
первый параметр.

```sql
select pf.login,
pf.last_updated,
nvl(pf.status, '') status
from profiles pf
```

![](/img/4_1_nulls/nvl.png)

Здесь мы получаем данные из таблицы профилей, и в том случае, если
статус пуст, выводим строку "".

## Nvl2

Функция `nvl2` работает немного сложнее. Она принимает 3 параметра. В
том случае, если первый параметр не `NULL`, она вернет второй параметр.
В противном случае она вернет третий параметр:

```sql
select pf.login,
    pf.last_updated,
    nvl2(pf.status, 'статус указан', 'статус не указан') status
from profiles pf
```

![](/img/4_1_nulls/nvl2.png)

## Coalesce

Данная функция принимает на вход любое количество параметров и
возвращает первое, из них, которое не является `NULL`:

```sql
select login,
       coalesce(status, 'статус пуст') first_not_null,
       coalesce(status, null, null, 'статус пуст') first_not_null_1,
       coalesce('статус всегда заполнен', status) first_not_null_2
from profiles
```

![](/img/4_1_nulls/coalesce.png)

В том случае, если в функцию `COALESCE` передаются параметры разных
типов, то все параметры будут приведены к типу первого `NOT NULL`
аргумента.

В том случае, если этого сделать не получится, будет выброшена ошибка:

```sql
select coalesce(null, 'String', 'String_2') not_null_str
from dual
```

![](/img/4_1_nulls/coalesce_1.png)

```sql
select coalesce(null, 'String', 23.4) not_null_str
from dual
```

![](/img/4_1_nulls/coalesce_error.png)

При этом, если число привести к строке самим, все будет работать, как
ожидается:

```sql
select coalesce(null, 'String', to_char(23.4)) not_null_str
from dual
```

![](/img/4_1_nulls/coalesce_1.png)
