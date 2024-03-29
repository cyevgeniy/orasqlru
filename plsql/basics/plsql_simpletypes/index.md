---
title: "Переменные, константы. Простые типы данных"
---

# Переменные, константы. Простые типы данных

Рассмотрим типы, которые позволяют хранить три сущности - числа, строки
и даты.

## Числа

Тип для хранения чисел в PL/SQL используется тот же тип данных, что и
при создании таблиц. Почитать про него можно
[здесь](/sql/basics/maintypes/).

:::info
Существуют и другие типы для работы с числами, например `PLS_INTEGER`,
`SIMPLE_INTEGER` и др. Они будут рассмотрены позже.
:::

## Даты

Для дат используются те же типы, что и в SQL - `Date` и `Timestamp`.

## Строки

Для хранения строк используются типы `Varchar2` и `CLOB`. Последний
расшифровывается как *Char Large Object*, и предназначен для хранения
очень больших объемов текстовой информации.

:::info
Стоит отметить разницу типов `Varchar2` в SQL и PL/SQL: в первом случае
максимальная длина ограничена 32767 байтами, во втором - 4000 байтами.
:::

## Логический тип

Логический тип данных используется для хранения значений True(истина)
или False(ложь). В PL/SQL такой тип данных называется `BOOLEAN`. Он еще
будет рассмотрен подробнеее далее в учебнике.

## Переменные

Переменные в PL/SQL должны объявляться в секции объявления переменных.
Так как мы пока рассмотрели только
[анонимные блоки](/plsql/basics/plsql_anonymous_blocks/), работать будем с ними.

Напишем анонимный блок, в котором задействуем переменные:

```plsql
declare
    age number;
    name varchar2(100 char);
begin
    age := 45;
    name := 'Alex';

    dbms_output.put_line(age);
    dbms_output.put_line(name);
end;
/
```

Вывод на экран:

    45
    Alex

Выше мы объявили две переменные, `age` и `name`, которым позднее
присвоили значения.

Присваивание значений переменным допускается сразу после их определения:

```plsql
declare
    age number := 45;
    name varchar2(100 char) := 'Alex';
begin
    null;
end;
/
```

:::warning
Следует обратить внимание на то, что при объявлении строкового типа
нужно указываеть размер, как в примере выше.
:::

Команда null ничего полезного не делает, в PL/SQL она используется для
того, чтобы подставлять ее в те места, где компилятор требует наличия
команды. Так и в нашем примере - исполняемый блок должен что-то иметь
внутри себя.

После объявления переменных с ними можно производить различные операции
- арифметические, логические, булевы и так далее. Не будем все
рассматривать детально, так как сложностей здесь возникать не должно.

```plsql
declare
    age number := 10;
    name varchar2(100 char) := 'Alex';
begin
    age := age + 20;
    name := 'Hello, ' || name;

    dbms_output.put_line(age);
    dbms_output.put_line(name);
end;
/
```

Вывод:

    30
    Hello, Alex

## Константы

Константа - это переменная, значение которой нельзя изменять.

Пример объявления константы:

```plsql
declare
    MIN_AGE constant number := 21;
begin
    dbms_output.put_line('Минимальный возраст для входа: ' || MIN_AGE);
end;
/
```

Вывод:

    Минимальный возраст для входа: 21

:::info
Константе должно присваиваться значение сразу после ее объявления.
:::

Значение констант нельзя изменять, но во всем остальном они работают
точно также, как и переменные:

```plsql
declare
    DEFAULT_NAME VARCHAR2(10) := 'Anonymous';
    MIN_AGE constant number := 21;
    user_name varchar2(50);
    user_age number;
begin
    -- Присваиваем значение константы переменной
    user_name := DEFAULT_NAME;
    user_age := MIN_AGE;

    dbms_output.put_line(user_name);
    dbms_output.put_line(user_age);

    -- Увеличиваем значение переменной на значение константы
    user_age := user_age + MIN_AGE;
    
    dbms_output.put_line(user_age);

end;
/
```

Вывод:

    Anonymous
    21
    42
