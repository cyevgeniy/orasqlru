---
Title: "Объединение. UNION"
weight: 1
toc: false
---


Предположим, что у нас есть 2 таблицы - таблица учителей `teachers` и
таблица учеников `students`:

    create table teachers(
        id number primary key,
        first_name varchar2(50) not null,
        last_name varchar2(100)
    );

    create table students(
        id number primary key,
        first_name varchar2(50) not null,
        last_name varchar2(100),
        group_id number
    );

        insert into teachers values (1, 'Галина', 'Иванова');
        insert into teachers values (2, 'Нина', 'Сидорова');
        insert into teachers values (3, 'Евгения', 'Петрова');

        insert into students values (1, 'Александр', 'Обломов', 1);
        insert into students values (2, 'Николай', 'Рудин', 2);
        insert into students values (3, 'Евгения', 'Петрова', 1);

Перед нами стоит задача - нужно отобразить единым списком учителей и
учеников.

Мы можем написать запрос для получения списка учителей:

    select first_name, last_name
    from teachers

Точно также можно получить список всех учеников:

    select first_name, last_name
    from students

Для того, чтобы эти данные "склеить", используется оператор `UNION`:

    select first_name, last_name
    from teachers

    union

    select first_name, last_name
    from students

![](/img/7_unions/union_example.png)

Если внимательно посмотреть на получившийся результат, то можно
заметить, что данных в "склеенной" выборке стало меньше.

Все дело в том, то оператор UNION удаляет дубликаты из итоговой выборки.
А так как у нас есть учитель "Евгения Петрова" и ученик "Евгения
Петрова", то при объединении оставляется только одна строка.

Для того, чтобы объединить данные из нескольких запросов без удаления
дубликатов, используется оператор `UNION ALL`:

    select first_name, last_name
    from teachers

    union all

    select first_name, last_name
    from students

Если вы знаете, что в объединяемых данных не будет повторяющихся строк,
используйте `UNION ALL`. В таком случае БД не будет тратить время на то,
чтобы убрать дубликаты из итоговой выборки.

Для того, чтобы `UNION` работал, должны соблюдаться некоторые условия:

-   Количество полей в каждой выборке должно быть одинаковым
-   Поля должны иметь одинаковый тип

То есть, следующий запрос вернет ошибку, т.к. в первой части объединения
запрос возвращает число первой колонкой, а второй - строку:

    select id, first_name
    from teachers

    union

    select first_name, last_name
    from students

Результат - ошибка
`ORA-01790: expression must have same datatype as corresponding expression`.

Кстати, псевдонимы столбцов не обязательно должны совпадать у всех
частей соединения:

    select first_name teacher_first_name, last_name teacher_last_name
    from teachers

    union

    select first_name, last_name
    from students

![](/img/7_unions/union_aliases.png)

Следует обратить внимание на то, что в результирующей выборке псевдонимы
для колонок взялись такие же, как и в запросе из первой части
объединения. Если поменять эти части местами, то псевдонимы также
изменятся:


    select first_name, last_name
    from students

    union

    select first_name teacher_first_name, last_name teacher_last_name
    from teachers

![](/img/7_unions/union_aliases_1.png)
