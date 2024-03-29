---
Title: "Уникальные ключи"
weight: 3
toc: true
---

# Уникальные ключи

Возьмем нашу таблицу с сотрудниками и добавим туда колонку с номером
паспорта сотрудника. Может ли у двух разных людей быть одинаковый номер
паспорта? Однозначно нет. Если в наших данных возникнет такая ситуация,
когда у нескольких сотрудников по ошибке указали один и тот же номер
паспорта, это может обернуться серьезными ошибками - клиентская
программа выдаст по поиску несколько записей вместо одной, либо вообще
выдаст ошибку и закроется. Или в бухгалтерии переведут деньги не тому
сотруднику, или наоборот, всем.

В любом случае, подобной ситуации нужно избежать. Это помогут сделать
уникальные ключи.

На колонки с уникальными ключами, как и на колонки с первичными ключами,
можно ссылаться из других таблиц по внешним ключам.

В отличие от первичных, в одной таблице может быть несколько уникальных
ключей.

## Создание уникальных ключей

```sql
create table employees(
    id number primary key,
    emp_name varchar2(200 char) not null,
    pas_no varchar2(30),
    constraint employees_pas_no_uk unique(pas_no)
)
```

Теперь попробуем добавить нескольких сотрудников с одинаковыми номерами
паспортов:

```sql
-- Эта строка добавляется в таблицу без проблем
insert into employees(id, emp_name, pas_no)
values (1, 'Евгений Петров', '01012020pb8007');

-- А вот эту уже добавить нельзя - уникальный ключ
-- в таблице будет нарушен
insert into employees(id, emp_name, pas_no)
values (2, 'Алексей Иванов', '01012020pb8007');
```

::: info
Уникальные ключи на строковых данных чувствительны к регистру.
:::

```sql
-- Эта строка добавляется без проблем
insert into employees(id, emp_name, pas_no)
values (2, 'Алексей Иванов', '01012020PB8007');
```

Пробелы вначале и конце строк также учитываются, поэтому следующие
данные также успешно добавятся в таблицу:

```sql
insert into employees(id, emp_name, pas_no)
values (3, 'Петр Иванов', '   01012020PB8007');

insert into employees(id, emp_name, pas_no)
values (4, 'Иван Петров', '01012020PB8007  ');

insert into employees(id, emp_name, pas_no)
values (5, 'Светлана Сидорова', '  01012020PB8007  ');
```

Наличие подобных данных в таблице также ошибка - как ни крути, номер
паспорта у всех этих сотрудников все равно совпадает. Поэтому в подобных
случаях, когда регистр строк и наличие пробелов в начале или конце
строки не должны учитываться, строки хранят в верхнем или нижнем
регистре, а пробелы обрезают перед вставкой.

Т.е. вставка данных в таблицу выглядит подобным образом:

```sql
-- Сначала удаляем пробелы(TRIM), потом приводим к верхнему
-- регистру(UPPER)
insert into employees(id, emp_name, pas_no)
values (6, 'Светлана Сидорова', UPPER(TRIM('  01012020PB8007  ')));
```

Значения в колонке с уникальным ключом могут содержать `NULL`, причем
строк с пустыми значениями может сколько угодно.

Следующий запрос выполнится без ошибок, и добавит 2 сотрудника с пустыми
номерами паспортов:

```sql
insert into employees(id, emp_name, pas_no)
values (7, 'Иван Иванов', NULL);

insert into employees(id, emp_name, pas_no)
values (8, 'Петр Петров', NULL);
```

Следует отметить, что это сработает только в том случае, если
`NULL`-значения разрешены в колонке, как в нашем случае. Если бы колонка
была `NOT NULL`, то в таком случае, конечно, пустые значения туда не
положишь.

## Составные уникальные ключи

Создадим таблицу месячных бонусов сотрудников с использованием
уникального ключа, а не первичного:

```sql
create table bonuses(
    emp_id number,
    mnth date,
    bonus number,
    constraint bonuses_uk unique(emp_id, mnth)
);
```

Также, как и с первичным, вставить 2 строки с одинаковыми значениями не
получится:

```sql
insert into bonuses(emp_id, mnth, bonus)
values(1, to_date('2020.01.01', 'yyyy.mm.dd'), 100);

-- Будет нарушена уникальность ключа bonuses_uk
insert into bonuses(emp_id, mnth, bonus)
values(1, to_date('2020.01.01', 'yyyy.mm.dd'), 200);
```

Но т.к. в уникальном ключе разрешены `NULL`-значения (и они разрешены в
нашей таблице), следующие строки добавятся без проблем:

```sql
insert into bonuses(emp_id, mnth, bonus)
values(2, to_date('2020.01.01', 'yyyy.mm.dd'), 200);

insert into bonuses(emp_id, mnth, bonus)
values(null, null, 200);

insert into bonuses(emp_id, mnth, bonus)
values(null, to_date('2020.01.01', 'yyyy.mm.dd'), 200);
```

Более того, в случае, когда все колонки уникального ключа пусты,
добавлять строк можно сколько угодно(при условии, что не будет нарушена
целостность других существующих в таблице ключей):

```sql
insert into bonuses(emp_id, mnth, bonus)
values(null, null, 200);

insert into bonuses(emp_id, mnth, bonus)
values(null, null, 200);

insert into bonuses(emp_id, mnth, bonus)
values(null, null, 200);
```
