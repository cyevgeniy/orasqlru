---
Title: "Агрегирующие функции"
weight: 5
toc: true
---

# Агрегирующие функции

Агрегирующие функции - это такие функции, которые выполняются не для
каждой строки отдельно, а для определенных групп данных.

## Подготовка данных

```sql
create table employees(
    id number not null,
    first_name varchar2(50 char) not null,
    last_name varchar2(100 char),
    bd date not null,
    job varchar2(100)
);

insert into employees
values(1, 'Василий', 'Петров',
    to_date('07.10.1990', 'dd.mm.yyyy'), 'Машинист');

insert into employees
values(2, 'Александр', 'Сидоров',
    to_date('18.07.1980', 'dd.mm.yyyy'), 'Бухгалтер');

insert into employees
values(3, 'Евгения', 'Цветочкина',
    to_date('18.07.1978', 'dd.mm.yyyy'), 'Бухгалтер');

insert into employees
values(4, 'Владимир', 'Столяров', 
    to_date('18.07.1977', 'dd.mm.yyyy'), 'Слесарь');
```

Например, следующий запрос найдет минимальную дату рождения среди всех
сотрудников:

```sql
select min(bd)
from employees
```

![](/img/9_aggregations/minbd.png)

```sql
select min(bd) minbd, max(bd) maxbd
from employees
```

![](/img/9_aggregations/minbd_maxbd.png)

Здесь также были добавлены псевдонимы `minbd` и `maxbd` для колонок.

Агрегирующие функции могут быть использованы в выражениях:

```sql
select min(bd) + 1 minbd,
       add_months(max(bd), 2) maxbd
from employees
```

![](/img/9_aggregations/minbd_maxbd_modified.png)

Но получение одной-единственной даты мало что дает, хотелось бы видеть
больше данных, соответствующих минимальной или максимальной дате в
наборе данных.

```sql
    select min(bd), max(bd), first_name
    from employees
    group by first_name
```

![](/img/9_aggregations/groupby_1.png)

Если посмотреть на результат запроса, то все равно трудновато понять,
что дают в этом примере добавление имени и группировка записей по нему.
Для лучшего понимания добавим в таблицу еще пару записей:

```sql
insert into employees
values(5, 'Евгения', 'Кукушкина',
    to_date('18.07.1989', 'dd.mm.yyyy'), 'Арт-директор');

insert into employees
values(6, 'Владимир', 'Кукушкин', 
    to_date('22.05.1959', 'dd.mm.yyyy'), 'Начальник департамента охраны');
```

Теперь выполним запрос еще раз:

```sql
select min(bd), max(bd), first_name
from employees
group by first_name
```

![](/img/9_aggregations/groupby_2.png)

Теперь можно заметить несколько особенностей:

-   Количество строк не изменилось
-   В строке с именем "Евгения" изменилась максимальная дата рождения
-   В строке с именем "Владимир" изменилась минимальная дата рождения

Видно, что агрегирующие функции могут применяться не ко всему набору
данных, а к определенным частям этого набора. В данном случае группы
были разбиты по именам, т.е. 2 записи с именем "Евгения", 2 записи с
именем "Владимир", а остальные записи представляют собой отдельные
группы из одного элемента.

При этом следует обратить внимание, что несмотря на то, что остальные
колонки в строках с именем "Евгения" или "Владимир" отличаются между
собой, они все равно попадают в одну группу, т.к. группировка
производится только по имени.

## Having

Выведем список имен, которые встречаются более одного раза:

```sql
select first_name, count(*)
from employees
group by first_name
having count(*) > 1
```

![](/img/9_aggregations/having.png)

`Having` работает аналогично условию `where`, но только для значений
агрегатных функций.
