---
Title: "Соединения таблиц"
weight: 11
toc: true
---

# Соединения таблиц

Работать с одной таблицей в БД приходится редко. Как правило, данные
распределены по нескольким таблицам, которые связаны между собой.

## Подготовка данных

Для демонстрации соединений понадобится несколько таблиц.

    create table app_users(
        login varchar2(50 char) primary key,
        registration_date date default sysdate not null,
        email varchar2(200 char) not null
    );

    comment on table app_users is 'Пользователи';

    create table app_roles(
        role_id number(10) primary key,
        role_name varchar2(50) not null
    );

    comment on table app_roles is 'Роли в системе';

    create table user_roles(
        login varchar2(50 char) not null,
        role_id number(10) not null,
        constraint user_roles_login_fk foreign key(login)
        references app_users(login),
        constraint user_roles_role_id_fk foreign key(role_id)
        references app_roles(role_id)
    );

    insert into app_users
    values('johndoe', sysdate, 'johndoe@johndoemail.com');

    insert into app_users
    values('alex', sysdate, 'alexman@mail.com');

    insert into app_users
    values('kate', sysdate, 'kate@somemaill.com');

    insert into app_users
    values('mike', sysdate, 'mike@mikemailll.com');

    insert into app_users
    values('dmitry', sysdate, 'dmitry@somemaill.com');

    insert into app_users
    values('mr_dude', sysdate, 'mr_dude@email.dude');

    insert into app_roles values(1, 'admin');
    insert into app_roles values(2, 'boss');
    insert into app_roles values(3, 'employee');
    insert into app_roles values(4, 'support');

    insert into user_roles values('johndoe', 1);
    insert into user_roles values('johndoe', 2);
    insert into user_roles values('johndoe', 3);
    insert into user_roles values('alex', 3);
    insert into user_roles values('kate', 3);
    insert into user_roles values('mike', 2);
    insert into user_roles values('dmitry', 3);

Информация о пользователях хранится в нескольких таблицах. Для того,
чтобы получить данные "вместе", придется использовать соединения.

## Join

Получим список пользователей вместе с ролями, которыми они обладают в
системе:

    select au.login, au.email, ar.role_name
    from app_users au
    JOIN user_roles ur on au.login = ur.login
    JOIN app_roles ar on ar.role_id = ur.role_id

Получим следующий результат:

![](/img/5_joins/joins_intro.png)

Приведенный запрос можно читать по порядку:

1.  Берем все записи из таблицы `user_roles`
2.  Теперь "приклеиваем" справа к нашему набору данных строки из таблицы
    `app_roles`, у которых в колонке `role_id` содержатся такие же
    значения, как и в колонке `role_id` таблицы `user_roles`. При этом
    строки, у которых эти значения не совпадают, убираются из
    результирующего набора
3.  К получившемуся на шаге 2 набору данных "приклеиваем" справа строки
    из таблицы app_users, у которых значение в колонке login совпадает
    со значением колонки `login` в таблице `user_roles`. Опять же,
    строки, у которых эти значение не совпадают, удаляются из
    результирующего набора данных.
4.  Из получившегося набора данных, выбираем только колонки `login`,
    `email`, `role_name`. После "склейки" данных наш набор содержит все
    колонки, которые содержатся в используемых таблицах, так что мы
    могли показать значения вообще любых колонок из любой из этих трех
    таблиц(либо вообще все).

Рассмотрим соединение строк для пользователя с ником `johndoe`:
Сначала соединяются таблицы `app_users` и `user_roles`.
В результат соединения попадают строки, у которых совпадает логин пользователя.


![](/img/5_joins/joins-1.svg)

В результате соединения мы получим следующий набор данных(колонку с датой регистрации не показываем):


![](/img/5_joins/joins-2.svg)

Здесь следует обратить внимание на то, что значения строк из таблицы
`app_users` повторяются для каждой из строк в таблице  `user_roles`.
Затем мы соединяем получившийся набор данных с таблицей `APP_ROLES`, и
к выборке приклеиваются ещё три строки, имеющие совпадение, на этот раз
по значению в колонке `ROLE_ID`. При этом строки, которые не имеют совпадения, в выборку не добавляются:

![](/img/5_joins/joins-3.svg)


## Left join

Предыдущий запрос выводил только тех пользователей, у которых
действительно были назначены некие роли в приложении. Теперь покажем
всех пользователей и их роли. Для этого будет использоваться
`LEFT JOIN`. Он отличается от обычного `JOIN` тем, что он не убирает
строки из уже имеющегося набора данных когда "приклеивает" справа новые
данные.

    select au.login, au.email, ar.role_name
    from app_users au
    LEFT JOIN user_roles ur on au.login = ur.login
    LEFT JOIN app_roles ar on ar.role_id = ur.role_id

![](/img/5_joins/left_join_result.png)

Как видно, теперь к результирующей выборке добавился пользователь
`mr_dude`, которому не были назначены права.

Схематично процесс "приклеивания" показан на рисунке:

![](/img/5_joins/simple_join.png)

Исходная таблица и первый `JOIN`(или `LEFT JOIN`) дают некий набор
данных, который обозначен цифрой "1". Все, далее стоит этот набор данных
рассматривать как одну таблицу, к которой еще раз "приклеиваются" данные
с помощью еще одного соединения.

Еще одна схема соединений:

![](/img/5_joins/JOIN.png)

Она показывает, что если одной записи в левой части нашего "текущего"
набора данных соответствует несколько строк в "добавляемой" таблице, то
количество строк после соединения увеличится - для одна строка из левой
части набора данных будет соединена \*с каждой\* строкой из правой части
данных.

## Соединение таблиц без join

Пример из части, где описывалось соединение `join`, может быть записан и
без использования этого самого `join`.

    select au.login, au.email, ar.role_name
    from app_users au
    JOIN user_roles ur on au.login = ur.login
    JOIN app_roles ar on ar.role_id = ur.role_id

    select au.login, au.email, ar.role_name
    from app_users au,
    user_roles ur,
    app_roles ar
    where au.login = ur.login
    and   ar.role_id = ur.role_id

Эти два запроса идентичны.

Вообще, Oracle позволяет записать и left/right join - соединения
подобным образом, указывая правила соединения в части `where` запроса.
Данный синтаксис использовался до версии БД = 9i и здесь рассматриваться
не будет.
