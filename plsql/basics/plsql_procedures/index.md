---
Title: "Процедуры в PL/SQL"
weight: 9
toc: true
---

## Пример создания простой процедуры

    create or replace procedure validate_age(
        page number
    )
    is
    begin
        if page < 18 then
            dbms_output.put_line('Вам должно быть 18 или больше');
        else
            dbms_output.put_line('Всё хорошо');
        end if;
    end;

Вызовем процедуру c несколькими параметрами:

    begin
        validate_age(17);
        validate_age(40);
    end;
    /

Вывод:

    Вам должно быть 18 или больше
    Всё хорошо

Как видно, особых отличий от создания функций нет. Основное отличие -
процедуры не возвращают значений в таком виде, как это делают функции
(через вызов `return`).

## Общепринятые различия между функциями и процедурами

См. [Различия между функциями и процедурами]({{< relref "plsql_schema" >}}).

## IN, OUT, IN OUT параметры

Каждый параметр функции или процедуры может иметь модификатор,
отвечающий за характер данного параметра:

-   `IN`- входной параметр
-   `OUT`- выходной параметр
-   `IN OUT`- входной и выходной параметр

По умолчанию все параметры являются входными, так что явно указывать
`IN` необязательно. Такие параметры нельзя изменять в теле процедуры или
функции.

`OUT`-параметры, наоборот, предназначены для того, чтобы быть
измененными. Часто их используют в процедурах для того, чтобы вернуть
некоторое значение(или даже несколько значений).

    create or replace procedure get_const_values(
        min_date out date,
        max_date out date,
        default_date out date
    )
    is
    begin
        min_date := to_date('1800-01-01', 'yyyy-mm-dd');
        max_date := to_date('4021-01-01', 'yyyy-mm-dd');
        default_date := sysdate;
    end;
    /

После этого выполним следующий код:

    declare
        l_min_date date;
        l_max_date date;
        l_default_date date;
    begin
        get_const_values(l_min_date, l_max_date, l_default_date);

        dbms_output.put_line(l_min_date);
        dbms_output.put_line(l_max_date);
        dbms_output.put_line(l_default_date);
    end;
    /

Вывод:

    01-JAN-00
    01-JAN-21
    05-DEC-21

OUT параметры не могут иметь значений по умолчанию:

    create or replace procedure get_const_values(
        min_date out date := to_date('1800-01-01', 'yyyy-mm-dd'),
        max_date out date := to_date('4021-01-01', 'yyyy-mm-dd')
    )
    is
    begin
        null;
    end;
    /

В результате функция будет создана с ошибкой
`OUT and IN OUT formal parameters may not have default expressions`.

<div class="alert alert-info">

Как определять ошибки при создании хранимых процедур, будет рассказано в
отдельной части.

</div>

`IN OUT` параметры доступны для чтения внутри хранимой процедуры, но в
то же время они доступны и для изменения.

    create or replace procedure get_const_values(
        min_date in out date,
        max_date in out date 
    )
    is
    begin
        -- Читаем значения переменных
        dbms_output.put_line(min_date);
        dbms_output.put_line(min_date);

        -- Изменяем значения переменных
        min_date := to_date('3000-02-02', 'yyyy-mm-dd');
        max_date := to_date('3001-02-02', 'yyyy-mm-dd');

    end;
    /

Запустим эту процедуру и выведем на экран значение переменных после её
выполнения:

    declare
        l_min date := to_date('1900.01.01', 'yyyy-mm-dd');
        l_max date := to_date('1900.01.01', 'yyyy-mm-dd');
    begin
        get_const_values(l_min, l_max);

        dbms_output.put_line(l_min);
        dbms_output.put_line(l_max);
    end;
    /

Вывод:

    01-JAN-00
    01-JAN-00
    02-FEB-00
    02-FEB-01

Как можно заметить, значения переменных были изменены после вызова
процедуры.

Важной особенностью `OUT` и `IN OUT` параметров является то, что они
должны быть переданы в виде переменных, задать их значения литералом
нельзя:

    create or replace procedure myproc(
        page out number
    )
    is
    begin
        dbms_output.put_line(page);
    end;
    /

И теперь попробуем вызвать процедуру, используя литерал, а не
переменную:

    begin
        myproc(12);
    end;
    /

В результате получим ошибку
`expression '12' cannot be used as an assignment target`.

## Удаление процедуры

Чтобы удалить процедуру из схемы, используется команда `drop procedure`:

    drop procedure myproc;
