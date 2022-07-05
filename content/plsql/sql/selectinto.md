---
Title: "Передача результатов SQL в переменные"
weight: 1
---

Сам по себе PL/SQL бесполезен, если мы не сможем взаимодействовать
с данными, которые хранятся в БД. В этой части мы рассмотрим, как
сохранять результаты запросов в переменных, а также как легко
можно использовать переменные PL/SQL в SQL-запросах.

## Подготовка данных

```
create table users(
    id number primary key,
    username varchar2(50) not null,
    create_date date default sysdate not null,
    is_admin number default 0
);

insert into users(id, username, create_date)
values(1, 'nagibator', to_date('2022-01-01', 'yyyy-mm-dd'));

insert into users(id, username, create_date)
values(2, 'ordinaryuser', to_date('2022-03-15', 'yyyy-mm-dd'));

insert into users(id, username, create_date)
values(3, 'reporter', to_date('2022-03-08', 'yyyy-mm-dd'));

insert into users(id, username, create_date, is_admin)
values(4, 'admin', to_date('2021-01-01', 'yyyy-mm-dd'), 1);
```


## Сохранение единичных результатов в переменные

Сохранение результатов выборки в переменные PL/SQL осуществляется
через конструкцию `select ... into`.

Рассмотрим самый простой вариант - сохранить результат
выполнения одного `select` запроса в переменную:

```
declare
    -- Объявление переменной
    l_username varchar2(50);
begin
    select username into l_username
    from users
    where id = 1;
    
    dbms_output.put_line(l_username);

end;
```

Результат:

```
nagibator
```

## Выборка нескольких значение

Мы можем получать из одного SQL запроса несколько колонок и сразу сохранять их
в переменных:

```
declare
    l_user_id number;    
    l_username varchar2(50);
begin
    select id, username into l_user_id, l_username
    from users
    where id = 1;
    
    dbms_output.put_line(l_user_id);
    dbms_output.put_line(l_username);

end;
```

Результат:

```
1
nagibator
```

Количество колонок из запроса и количество переменных, в которые
они сохраняются, должно быть одинаково. Следующий код
не будет выполнен и выбросит ошибку `ORA-00947: not enough values`:

```
declare
    l_user_id number;    
begin
    -- Будет выброшена ошибка, т.к. запрос возвращает
    -- две колонки, а принимающая переменная только одна
    select id, username into l_user_id 
    from users
    where id = 1;
end;
```

## Обработка ошибок

Все предыдущие варианты работают в тех случаях, когда
запрос возвращает ровно одну строку. Сохранение
нескольких строк в переменные будет рассмотрено в
части про коллекции в PL/SQL.
