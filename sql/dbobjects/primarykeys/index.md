---
Title: "Первичные ключи"
weight: 1
toc: true
---

Рассмотрим следующую ситуацию: пусть у нас есть 2 таблицы. Первая
содержит список сотрудников, вторая - размер бонусов к зарплате для
какой-то части этих сотрудников.

В жизни есть определенная вероятность того, что двух разных людей могут
звать одинаково. Так вышло и у нас - 2 абсолютно разных сотрудника имеют
одинаковое имя - "Алексей Иванов".

Предположим, что мы хотим одному из них начислить бонус в размере 200$.
Глядя на список сотрудников с бонусами, можем ли мы сказать, какому
именно Алексею Иванову мы должны начислить бонус в размере 200$?
Однозначный ответ - нет.

![](/img/13_relations/pk_problem.png)

Каждый отдельно взятый сотрудник - отдельная сущность, и всегда нужно
иметь возможность различать их между собой. Именно для этого и
используются первичные ключи.

<div class="alert alert-info">

Первичный ключ - это такой атрибут, который позволяет однозначно
идентифицировать отдельно взятую строку в таблице.

</div>

Исходя из этого можно выделить еще некоторые свойства первичного ключа:

1.  Он не может быть пустым
2.  Он уникален в пределах отдельно взятой таблицы
3.  В таблице может быть только один первичный ключ

## Добавление первичного ключа в таблицу

Добавить первичный ключ в таблицу можно несколькими способами. Первый -
добавление при создании таблицы:

    create table employees(
        id number primary key, -- Колонка id будет являться первичным ключом
        emp_name varchar2(100 char) not null,
        birth_date date not null
    );

Данный способ - самый простой. Мы просто добавляем к нужной колонке
`primary key`, и Oracle наделит ее всеми необходимыми свойствами.

Теперь давайте убедимся, что это действительно первичный ключ -
попробуем добавить 2 строки в таблицу с одинаковым значением колонки
`id`:

    insert into employees(id, emp_name, birth_date)
    values(1, 'Андрей Иванов', to_date('1984.12.04', 'yyyy.mm.dd'));

    insert into employees(id, emp_name, birth_date)
    values(1, 'Петр Иванов', to_date('1990.01.30', 'yyyy.mm.dd'));

Первая строка вставится без ошибок, но при попытке добавить еще одну с
уже существующим `id` получим ошибку
`ORA-00001: unique constraint (SQL_PXTWBEIMXHBUXOWCVTDQXEQKK.SYS_C0029851757) violated ORA-06512`.
Эта ошибка говорит о том, что произошла попытка нарушить свойство
уникальности нашего ключа. Длинная строка в скобках - это название
нашего ключа. При создании его таким способом Oracle автоматически
назначает каждому первичному ключу уникальное имя. В таких небольших
примерах нам легко понять, где именно произошла ошибка, но в сложных
системах с сотнями таблиц, с большим количеством запросов на вставку в
БД понять, на каком ключе происходит сбой очень трудно.

К счастью, мы можем сами назначать имя для первичного ключа при создании
таблицы:

    create table employees(
        id number,
        emp_name varchar2(100 char) not null,
        birth_date date not null,
        constraint employees_PK primary key(id) -- создаем первичный ключ и назначаем ему имя
    )

Теперь попробуем вставить дублирующие значения в колонку `id`:

    insert into employees(id, emp_name, birth_date)
    values(1, 'Андрей Иванов', to_date('1984.12.04', 'yyyy.mm.dd'));

    insert into employees(id, emp_name, birth_date)
    values(1, 'Петр Иванов', to_date('1990.01.30', 'yyyy.mm.dd'));

На этот раз сообщение об ошибке будет немного другим:
`ORA-00001: unique constraint (SQL_EAIYWBGLYOEYCEZDANCUIWUWH.EMPLOYEES_PK) violated`.
Теперь мы явно видим, что ошибка в ключе `EMPLOYEES_PK`.

## Составные первичные ключи

Первичный ключ может состоять из нескольких колонок. Подобный ключ
обладает теми же особенностями, что и ключ из одной колонки.

Рассмотрим примеры создания таблицы с составным первичным ключом.

Предположим, что мы хотим начислять дополнительные бонусы сотрудникам
каждый месяц. Одному сотруднику в месяц может быть начислено не более
одного бонуса. Данные в этой таблице могли бы выглядеть вот так:

    |id сотрудника |месяц     |Размер бонуса
    |1             |2020.01.01|300
    |1             |2020.02.01|150
    |2             |2020.02.01|240
    |3             |2020.02.01|100

Сделать колонку c id сотрудника первичным ключом нельзя, т.к. в таком
случае в таблице можно будет иметь лишь по одной строке на каждого
сотрудника. Но ключ из колонок с id сотрудника и месяца бонуса отлично
подойдет - на один месяц можно будет давать бонус только одному
сотруднику, в противном случае уникальность ключа будет нарушена.

    create table month_bonuses(
        emp_id number not null,
        month_bonus date not null,
        bonus_value number not null,
        constraint month_bonuses_pk primary key(emp_id, month_bonus)
    )

Указать `primary key` напротив нескольких колонок нельзя, т.к. Oracle
будет пробовать каждую из этих колонок сдалеть первичным ключом, а он
может быть только один. В итоге мы получим ошибку
`ORA-02260: table can have only one primary key`:

    -- Получим ошибку при создании таблицы!
    create table month_bonuses(
        emp_id number not null primary key,
        month_bonus date not null primary key,
        bonus_value number not null
    )