---
Title: "Выполнение SQL. Облачные сервисы"
---

# Выполнение SQL. Облачные сервисы

Для того, чтобы начать работу с БД(причем любой), она должна быть
где-либо установлена, и к ней должен быть доступ на подключение и
выполнение запросов.

## LiveSQL

В этом учебнике для выполнения sql-запросов будет использоваться сервис
[Live SQL](https://livesql.oracle.com/). Он позволяет выполнять SQL в
облаке, что непременно большой плюс - там гораздо быстрее
зарегистрироваться, чем скачивать, устанавливать и настраивать себе БД
Oracle.

Работать с livesql очень просто; опишем стандартные шаги, необходимые
для запуска своих sql-запросов.

Входим под своей учеткой, после чего в левом боковом меню выбираем "SQL
WorkSheet":

![](/img/1_intro/livesql_1.png)

В открывшемся окне вводим наши SQL-запросы:

![](/img/1_intro/livesql_2.png)

Чтобы выполнить запрос, написанный в SQL Worksheet, нажимаем на кнопку
"Run", которая находится сверху над полем для ввода текста запроса:

![](/img/1_intro/livesql_3.png)

Впринципе, работа с LiveSQL не должна вызывать вопросов, но на всякий
случай вот видео с youtube(на английском) c подробным описанием работы в
нем: <https://youtu.be/4oxsxJQQC-s>.

## SQL Fiddle

[SQL Fiddle](http://sqlfiddle.com/) - еще один популярный сервис для
работы с SQL. Поддерживает разные базы данных. Для работы SQLFiddle даже
не требует регистрации.

Далее будет описано, как работать с данным сервисом.

Сначала заходим на [SQL Fiddle](http://sqlfiddle.com/).

Т.к. сервис поддерживает работу с несколькими БД, нужно выбрать ту, с
которой будем работать - это Oracle:

![](/img/1_intro/sqlfiddle_1.png)

Перед началом работы SQL Fiddle требует создания схемы. Это значит, что
таблицы, с которыми нужно работать, должны быть созданы на этом этапе.
Вводим текст ddl-скрипта (скрипта, который создает таблицы и др. объекты
БД), после чего нажимаем на кнопку "Build Schema":

![](/img/1_intro/sqlfiddle_4.png)

После того, как схема будет построена, можно выполнять SQL-запросы. Они
вводятся в правой панели(она называется "Query Panel"). Чтобы выполнить
запрос, нажимаем на кнопку "Run Sql":

![](/img/1_intro/sqlfiddle_2.png)

Результаты выполнения запросов отображаются под панелями создания схемы
и ввода sql:

![](/img/1_intro/sqlfiddle_3.png)

## Запуск примеров учебника

Запускать примеры из учебника можно в любой среде. Тем не менее, в силу
того, что тема транзакций будет рассматриваться в самом конце, лучше
всего(и удобнее) использовать сервис LiveSQL.

В дальнейшем, при изучении PL/SQL, придется выбрать какую-нибудь IDE, но
при изучении базового SQL это необязательно.
