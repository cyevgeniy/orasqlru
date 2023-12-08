---
Title: "Взаимодействие SQL и PL/SQL"
toc: True
weight: 1
---

# Взаимодействие SQL и PL/SQL

Сам по себе PL/SQL бесполезен, если мы не сможем взаимодействовать
с данными, которые хранятся в БД. В этой части мы рассмотрим, как
сохранять результаты запросов в переменных, а также как легко
можно использовать переменные PL/SQL в SQL-запросах.

## Подготовка данных

```sql
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

```sql
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

## Выборка нескольких значений

Мы можем получать из одного SQL запроса несколько колонок и сразу сохранять их
в переменных:

```sql
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

```sql
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
части про коллекции в PL/SQL. Тем не менее, нужно учитывать,
что не всегда мы можем быть уверены в том, что
запрос будет возвращать ровно одну строку, и будет ли
вообще. Для того, чтобы программа не посыпалась, нужно
обработать возможные ошибки; мы рассмотрим два варианта - 
когда строк больше одной и когда их нет вообще. Это 
одни из самых первых ошибок, которые следует отлавливать
при сохранении данных в переменные PL/SQL.

Пример, когда запрос возвращает больше одной строки:

```sql
declare
    l_user_id number;
begin
    select id into l_user_id
    from users;
exception
    when too_many_rows then
        l_user_id := null;
end;
```

Пример, когда запрос не возвращает ни одной строки:

```sql
declare
    l_user_id number;
begin
    select id into l_user_id
    from users
    where id = -1;
exception
    when no_data_found then
        l_user_id := null;
end;
```

Обработаем обе возможные ошибки сразу:

```sql
declare
    l_user_id number;
begin
    select id into l_user_id
    from users
    where id = -1;
exception
    when no_data_found or too_many_rows then
        l_user_id := null;
end;
```

## Использование переменных в SQL запросах

Переменные SQL использовать *очень просто*:

```sql
declare
    l_user_id number := 1;
    l_username varchar2(50);
begin
    select username into l_username
    from users
    where id = l_user_id;
    
    dbms_output.put_line(l_username);
    
end;
```

В примере выше мы сохранили в значение id нужной нам записи в переменной 
`l_user_id`, после чего использовали её в запросе. Как видно, нам
не нужно делать абсолютно ничего, мы просто подставляем переменную
PL/SQL в SQL запрос, и всё работает отлично, благодаря **тесной интеграции
SQL и PL/SQL в Oracle**.

Ещё пример: получим количество записей в таблице и выведем его:

```sql
declare
    l_cnt number;
begin
    select count(*) into l_cnt
    from users;
    
    dbms_output.put_line(l_cnt);
end;
```

Результат:

```
4
```

Сохранять результаты запроса в константы нельзя:

```sql
declare
    l_cnt constant number := 20;
begin
    -- Возникнет исключение 
    select count(*) into l_cnt
    from users;
    
    dbms_output.put_line(l_cnt);
end;
```

Код выше вызовет ошибку `PLS-00403: expression 'L_CNT' cannot be
used as an INTO-target of a SELECT/FETCH statement`.

А вот использовать константы как параметры SQL запроса можно:

```sql
declare
    l_user_id constant number := 1;
    l_username varchar2(50);
begin
    select username into l_username
    from users
    where id = l_user_id;
    
    dbms_output.put_line(l_username);
    
end;
```
