---
Title: "Первая программа на PL/SQL"
weight: 3
toc: false
---

Итак, напишем нашу первую программу на PL/SQL. Но перед этим создадим
простую таблицу `users`, в которой будем хранить список пользователей
некой системы:

    create table users(
        id number primary key,
        login varchar2(60) not null,
        sign_date date default sysdate not null,
        is_active number(1) default 1 not null
    );

    insert into users
    values(1, 'UserA', to_date('21.01.2019', 'dd.mm.yyyy'), 1);

    insert into users
    values(2, 'UserB', to_date('15.07.2017', 'dd.mm.yyyy'), 1);

    insert into users
    values(3, 'UserC', to_date('02.10.2015', 'dd.mm.yyyy'), 1);

Теперь приведем текст программы:

    begin
        update users
        set is_active = 0
        where sign_date < to_date('01.01.2016', 'dd.mm.yyyy'); 
    end;
    /

Данный код делает неактивными всех пользователей, которые были
зарегистрированы ранее, чем первое января 2016 года.

Программа очень простая, но зато она наглядно демонстрирует важнейшую
особенность PL/SQL - **тесную интеграцию с SQL**. Любой SQL запрос может
быть вызван из PL/SQL, и это абсллютно нормально и естественно. На самом
деле, большую часть кода PL/SQL, как правило, составляют именно
SQL-запросы.

Здесь важно понимать, почему это PL/SQL программа, а не простой
SQL-запрос. Причиной является тот факт, что запрос заключен в
[анонимный блок]({{< relref "plsql_anonymous_blocks" >}}).

Внутри блока может находиться сколько угодно запросов. Например,
следующая программа делает неактивными пользователей,
зарегистрировавшихся раньше 2016 года, и добавляет нового пользователя:

    begin
        update users
        set is_active = 0
        where sign_date < to_date('01.01.2016', 'dd.mm.yyyy');

        insert into users
        values(4, 'UserD', SYSDATE);
    end;
    /
