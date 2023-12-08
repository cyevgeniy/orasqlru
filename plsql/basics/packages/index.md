---
Title: "Пакеты"
weight: 11
draft: false
toc: true
---

# Пакеты 

В данной части будут рассмотрены пакеты - основная сущность
при разработке на PL/SQL. Пакеты используются для группировки
функционала в именованные модули с возможностью разделения
интерфейса и реализации. На самом деле, мы уже сталкивались
с ними, когда рассматривали вывод на экран с использованием
`dbms_output.put_line`. `Dbms_output` - это пакет, а `put_line` - 
процедура, объявленная в данном пакете.

## Стуктура пакета

Пакеты как правило состоят из **спецификации** и **тела**.
Можно создать пакет без тела, только со спецификацией, такой
вариант использования тоже будет рассмотрен.

Спецификация пакета - это то, к чему можно обращаться при
работе с пакетом. В спецификации могут быть объявлены
типы, переменные, константы, сигнатуры процедур и функций.

Тело пакета содержит в себе код, необходимый для
реализации спецификации. Также он может содержать всё то же, что
спецификация - переменные, типы, константы и проч. Всё, что
содержится в теле, но не описано в спецификации, недоступно
для использования внешними модулями. Здесь можно провести аналогию
с публичными и приватными модификаторами доступа в ООП языках(
например, как `private` и `public` в Java).

![](/img/plsql/package_structure.png)

## Создание пакета

Общий синтаксис создания спецификации пакета выглядит
так:

```sql
create package pck_utils as
-- Specification code
end pck_utils;
```

Команда выше создаст пакет с названием `pck_utils`. Если
пакет с таким именем уже существует, будет выброшена ошибка,
и новый пакет не создастся. Чтобы заменить уже существующий
пакет, используется команда `create or replace`. На практике чаще
всего используют именно её:

```sql
create or replace package pck_utils as
-- Specification code
end pck_utils;
```

Тело пакета создаётся следующим образом:

```sql
create or replace package body pck_utils as
-- Specification code
end pck_utils;
```

Давайте создадим пакет и наполним его каким-нибудь функционалом:

```sql
create or replace package pck_date_utils as

-- Возвращает максимальную дату, 
-- используемую в системе
function maxdate return date;

-- Возвращает минимальную дату, 
-- используемую в системе
function mindate return date;

-- Добавляет указанное количество недель к
-- указанной дате. Для того, чтобы отнять
-- недели, нужно передать отрицательное число
function add_weeks(
    pdate date,
    pweeks number
) return date;

end pck_date_utils;
```

Это была спецификация пакета. Теперь создадим тело:

```sql
create or replace package body pck_date_utils as

function maxdate return date is
begin
    return to_date('4000.01.01', 'yyyy.mm.dd');
end;

function mindate return date is
begin
    return to_date('1800.01.01', 'yyyy.mm.dd');
end;

function add_weeks(
    pdate date,
    pweeks number
) return date
is
begin
    return pdate + (7 * pweeks);
end;

end pck_date_utils;
```

Теперь мы можем обращаться ко всему, что объявлено
в спецификации пакета в нашем коде. Обращение к содержимому
пакета осуществляется в виде `имя_пакета.объект`(под объектом
понимается всё, что объявлено в спецификации):

```sql
begin
    dbms_output.put_line(to_char(pck_date_utils.mindate, 'yyyy.mm.dd'));
    dbms_output.put_line(to_char(pck_date_utils.maxdate, 'yyyy.mm.dd'));
    dbms_output.put_line(to_char(pck_date_utils.add_weeks(sysdate, 3), 'yyyy.mm.dd'));
end;
```

Вывод:

```
1800.01.01
4000.01.01
2022.03.30
```

## Удаление пакета

Удаление производится командой `drop package`:

```sql
drop package pck_date_utils
```

## Компиляция пакета

В учебнике мы предполагаем, что текст пакета должен храниться в *файлах*,
как SQL скрипты. Спецификацию и тело, как правило, хранят в разных файлах,
с расширениями ".sql". Можно использовать любые другие расширения, например
".pks" для спецификации и ".pkb" для тела - подобные расширения также часто
используются. Когда нужно изменить пакет, код в этих файлах меняется,
после чего эти скрипты перезапускаются.

Если нужно произвести перекомпиляцию пакета, который уже создан,
без его изменения, можно воспользоваться командой `alter package`:

```sql
alter package pck_utils compile package;
```

```sql
alter package pck_utils compile specification;
```

```sql
alter package pck_utils compile body;
```


## Изменение пакета

Изменение пакета производится путём перекомпиляции
его спецификации или тела(используя `create or replace`).

Если спецификация пакета не изменяется, а только её реализация,
то её пересоздавать не нужно. Если же меняется и спецификация, 
то придётся перекомпилировать и спецификацию, и тело.

## Пакеты без тела

Можно создать пакет, который не будет иметь тела.
Как правило, это пакеты, которые содержат публичные
константы, типы или переменные:

```sql
create or replace package pck_user_gl as

-- Статусы пользователей
active constant number := 0;
deleted constant number := 1;
paused constant number := 2;

end pck_user_gl;
```

В данном пакете содержатся константы для
описания статусов пользователей.
Теперь мы можем обращаться к статусам, объявленным в пакете:

```
-- Выведет три строки:
-- 0
-- 2
-- 1
begin
    dbms_output.put_line(pck_user_gl.active);
    dbms_output.put_line(pck_user_gl.paused);
    dbms_output.put_line(pck_user_gl.deleted);
end;
```
Напомним, что констатны и переменные PL/SQL нельзя использовать в SQL запросах,
но они могут быть использованы в другом PL/SQL коде.

## Перегрузка процедур и функций

Внутри пакета можно объявить несколько функций
или процедур с одним и тем же именем, но с разной
сигнатурой. Подобная возможность в языках программирования
называется перегрузкой(overloading). Простейший пример
перегруженных функций(процедур) - это `dbms_output.put_line`.
Мы можем вызывать данную процедуру как со строками, так и с
датами или числами. Создадим свой пакет для вывода информации
на экран, только с более коротким именем процедуры, для удобной
работы:

```sql
create or replace package pck_output as

procedure print(v varchar2);
procedure print(v number);
procedure print(v date);

end pck_output;
```

В спецификации мы объявили три разных сигнатуры - несмотря на то,
что имена у них одинаковые, они отличаются типами принимаемых аргументов.
Теперь создадим тело пакета:

```sql
create or replace package body pck_output as

procedure print(v varchar2) is
begin
    dbms_output.put_line(v);
end;

procedure print(v number) is
begin
    dbms_output.put_line(v);
end;

procedure print(v date) is
begin
    dbms_output.put_line(v);
end;

end pck_output;
```

Скомпилируем пакет и проверим, как он работает:

```sql
-- Выведет строки:
-- 19-MAR-22
-- 34.23
-- Hello, World
declare
    v1 date := sysdate;
    v2 number := 34.23;
    v3 varchar2(20) := 'Hello, World';
begin
    pck_output.print(v1);
    pck_output.print(v2);
    pck_output.print(v3);
end;
```

Функции можно перегружать, если они отличаются 

- Количеством аргументов
- Типами аргументов

Имена аргументов при этом не важны - не получится создать две процедуры вида:

```
procedure proc1(name varchar2);
procedure proc1(username varchar2);
```

Но зато получится создать такие процедуры:

```sql
procedure proc1(name varchar2);

-- Отличается от предыдущей количеством аргументов
procedure proc1(name varchar2, trim: boolean);

-- отличается от предыдущей типами аргументов
procedure proc1(name varchar2, trim: number);
```

## Сессии и состояния

Каждая сессия в БД работает со своей копией пакета в памяти, что
означает, что состояние переменных пакета *локально для сессии,
использующей его*. Рассмотрим простой пример:

```sql
create or replace package pck_test as

current_number number := 10;

end pck_test;
```

Пакет содержит одну переменную `current_number`
со значением по-умолчанию, равным 10. Предположим, с пакетом будут
работать две сессии, А и Б:

Сессия А:

```sql
begin
    dbms_output.put_line(pck_test.current_number);
end;
```

Сессия Б:

```sql
begin
    dbms_output.put_line(pck_test.current_number);
end;
```

Результат будет одинаковым в двух сессиях:

```
10
```

Теперь изменим значение переменной в первой сессии:

```sql
-- Сессия А
begin
    pck_test.current_number := 20;
end;
```

После чего выведем содержимое переменной в двух сессиях:

```sql
-- Сессия А:
begin
    dbms_output.put_line(pck_test.current_number);
end;
```

```sql
-- Сессия Б:
begin
    dbms_output.put_line(pck_test.current_number);
end;
```

И получим следующий результат:

Сессия А:
```
20
```

Сессия Б:
```
10
```

Как видно, изменения переменной, произведённые в первой сессии,
не повлияли на значение той же переменной пакета во второй сессии.

Если в пакете объявлена хотя бы одна переменная, константа, или курсор(не важно где,
в теле пакета или в его спецификации), то пакет обладает *состоянием*. Когда Oracle
создаёт экземпляр пакета, в сессии также хранится и состояние. Изменения в состоянии пакета
сохраняются на всё время работы сессии(за исключением пакетов, объявленных как `SERIALLY_REUSABLE`,
это будет будет рассмотрено в отдельной части). Но состояние может быть сброшено, если пакет
был перекомпилирован.

Сброс состояния означает, что изменения, произведённые с переменными
или курсорами, будут утеряны, и оракл выбросит ошибку с сообщением о том,
что состояние пакета было сброшено. Способы уменьшения вероятности сброса состояния
будут рассмотрены в отдельной части, посвящённой продвинутой работе с пакетами.

## Порядок загрузки пакета в память

Помимо создания экземпляра пакета в памяти при первоначальном
обращении к нему, Oracle производит его инициализацию, состоящую
из следующих шагов:

- Присваивание первоначальных значений публичным константам
- Присваивание первоначальных значений публичным переменным
- Запуск блока инициализации
  
## Блок инициализации

Блок инициализации добавляется в конце тела пакета
между ключевым словом `begin` и конструкцией `end package_name`, и как правило используется
для присваивания начальных значений переменным пакета. Сам блок является необязательным. 
Рассмотрим пример пакета с блоком инициализации:

```sql
-- Спецификация пакета
create or replace package pck_init as

init_val number;

procedure say_hello;

end pck_init;
/

-- Тело пакета
create or replace package body pck_init as

procedure say_hello
is
begin
    dbms_output.put_line('Привет, Мир!');
end;

--Секция инициализации
begin
    dbms_output.put_line('Инициализация пакета');
    init_val := 23;
end pck_init;
```

Теперь вызовем процедуру `say_hello` несколько раз подряд:

```sql
begin
    pck_init.say_hello();
    pck_init.say_hello();
    pck_init.say_hello();
end;
```

Результат:

```
Инициализация пакета
Привет, Мир!
Привет, Мир!
Привет, Мир!
```

Как видно, при первом обращении к пакету был вызван блок
инициализации, причём до выполнения процедуры `say_hello`.
При последующих обращениях к пакету инициализация не
производится. Инициализация выполняется при любом первичном
обращении к пакету, это не обязательно должна быть процедура
или функция:

```sql
begin
    -- Выведет две строки:
    -- Инициализация пакета
    -- 23
    dbms_output.put_line(pck_init.init_val);
end;
```

Считается правилом хорошего тона производить инициалиацию всех
переменных именно в блоке инициализации, а не при объявлении переменных.
Одна из причин - тот факт, что ошибки, которые могут возникнуть при инициализации переменных,
можно отловить только здесь. Исключения будут рассмотрены позже, но для быстрого ознакомления
приведём пример:

```sql
create or replace package pck_test is

min_age number(2) := 123;
default_name varchar2(3 char) := 'User';

end pck_test;
/
```

При создании пакета не будет выдани никаких сообщений об ошибке.
Но если мы попробуем вывести на экран значение `default_name`:

```sql
begin
    dbms_output.put_line(pck_test.default_name);
end;
```

То получим ошибку(Во время выполнения!) `ORA-06502: PL/SQL: numeric or value error: number precision too large ORA-06512`.
А при использовании блока инициализации ошибку можно отловить:

```sql
create or replace package pck_test is

min_age number(2);
default_name varchar2(3 char);

end pck_test;
/

create or replace package body pck_test is

begin
    min_age := 123;
    default_name := 'User';

exception
    when value_error then
        min_age := 18;
        default_name := 'NIL';
end pck_test;
/
```

В этот раз мы имеем возможность отловить все ошибки на стадии инициализации
пакета и предпринять нужные меры. Посмотрим, как это работает:

```sql
-- Выведет две строки:
-- NIL
-- 18
begin
    dbms_output.put_line(pck_test.default_name);
end;
```

## Ещё о функциях в пакетах

### Forward declaration

Порядок приватных функций/процедур в теле пакета имеет значение.
Если функция `A` использует функцию `B`, то функция `B` к тому моменту
должна быть объявлена, то есть находиться выше  в коде тела:

```sql
create or replace package pck_test as

procedure print_hello;

end pck_test;
```

```sql
create or replace package body pck_test as

procedure print_hello is
begin
    dbms_output.put_line(get_hello_message);
end;

function get_hello_message return varchar2
is
begin
    return 'Hello, World!';
end;

end pck_test;
```

Здесь процедура `print_hello` выводит на экран текст сообщения, который
возвращает функция `get_hello_message`, но сама процедура объявлена раньше, чем функция.
При компиляции тела мы получим ошибку `PLS-00313: 'GET_HELLO_MESSAGE' not declared in this scope` - она 
не объявлена на момент своего вызова.

Решить эту проблему можно несколькими способами. Во-первых, можно поместить функцию `get_hello_message`
выше процедуры:

```sql
create or replace package body pck_test as

function get_hello_message return varchar2
is
begin
    return 'Hello, World!';
end;

procedure print_hello is
begin
    dbms_output.put_line(get_hello_message);
end;

end pck_test;
```

Во-вторых, можно добавить функцию `get_hello_message` в спецификацию пакета,
и тогда порядок внутри тела не будет ни на что влиять:

```sql
create or replace package pck_test as

procedure print_hello;

function get_hello_message return varchar2;

end pck_test;
```

Но объявлять всё в спецификации - тоже не выход; Некоторые функции не должны
быть доступны для вызова всеми желающими. В таком случае можно использовать
так называемую *Forward declaration* - отделить описание функций от их реализации:

```sql
create or replace package body pck_test as

-- Объявляем функцию, но не указываем её реализацию
function get_hello_message return varchar2;

procedure print_hello is
begin
    -- Ошибки не будет, функция get_hello_message
    -- уже объявлена
    dbms_output.put_line(get_hello_message);
end;

-- Реализация функции get_hello_message
function get_hello_message return varchar2
is
begin
    return 'Hello, World!';
end;

end pck_test;
```

### Вызов функций в SQL запросах

Все функции, которые используются в SQL
запросах, должны быть созданы на уровне схемы, то есть
либо быть созданными как отдельные функции(`create function`),
либо быть объявленными в спецификации пакета. Рассмотрим на примере:

```sql
create or replace package pck_test as

procedure print_hello;

end pck_test;
```

```sql
create or replace package body pck_test as

function get_hello_message return varchar2
is
begin
    return 'Hello, World!';
end;

procedure print_hello is
    l_msg varchar2(50);
begin
    select get_hello_message() into l_msg
    from dual;
    
    dbms_output.put_line(l_msg);
end;

end pck_test;
```

При компиляции тела пакета мы получим ошибку `PLS-00231: function 'GET_HELLO_MESSAGE' may not be used in SQL`.
Это потому, что мы вызываем функцию из SQL, но данная функция не объявлена в спецификации пакета. Если
мы добавим её сигнатуру в спецификацию, то все будет работать:

```sql
create or replace package pck_test as

procedure print_hello;

function get_hello_message return varchar2;

end pck_test;
```

```
begin
    -- Выведет "Hello, World!"
    pck_test.print_hello;
end;
```
