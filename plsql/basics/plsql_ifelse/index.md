---
Title: "Условное ветвление. If...else...elsif"
---

# Условное ветвление. If...else...elsif

Условное ветвление используется тогда, когда нужно выполнить разные
действия в зависимости от условий. Для этого в PL/SQL используется
конструкция `if`.

## If

```sql
declare
    l_name varchar2(100) := 'Admin';
begin
    if l_name = 'Admin' then
        dbms_output.put_line('User is Admin');
    end if;
end;
/
```

В примере выше описан простейший вариант использования `if`. Если имя
пользователя равно строке "Admin", мы выводим соответствующее сообщение.

В конструкции `If` может быть несколько условий:

```sql
declare
    l_name varchar2(100) := 'Admin';
begin
    if l_name = 'Admin' or l_name = 'TempAdmin' then
        dbms_output.put_line('User is Admin');
    end if;
end;
/
```

Результат:

    User is Admin

В случае с логическими переменными, проверять на равенство true или
false не обязательно:

```sql
declare
    is_admin boolean := true;
begin
    if is_admin then
        dbms_output.put_line('Admin');
    end if;
end;
/
```

Общий принцип работы конструкции if таков: Если условие между
идентификаторами if и then принимает истинное значение, выполняется код,
находящийся между идентификаторами then и end if;

При проверке условий `Pl/sql`  использует так называемое "ленивое вычисление" - 
когда части условия вычисляются по порядку, и если можно сделать вывод о значении
всего условия, дальнейшее вычисление не производится.
Например, в следующем условии будет вычислен
только первый предикат(`2 > 3`):

```sql
begin
    if (2 > 3) and (3 < 4) and (5 > 4) then
        dbms_output.put_line('True');
    else
        dbms_output.put_line('False');
    end if;
end;
```

Выражение будет истинным только тогда, когда каждая его часть будет истинным.
Первое выражение у нас ложное, а значит, результат
проверки всего условия вернёт False.

## If...else

```sql
declare
    l_name varchar2(100) := 'Max';
begin
    if l_name = 'Admin' then
        dbms_output.put_line('User is Admin');
    else
        dbms_output.put_line('User is not Admin');
    end if;
end;
/
```

Результат:

    User is not Admin

Использование конструкции else позволяет выполнять некий код в том
случае, если условие принимает ложное значение. В примере выше, значение
переменной l_name не равно строке "Admin", поэтому выполняется код,
который находится между else и end if;

## if...elsif

```sql
declare
    l_name varchar2(20) := 'Max';
begin
    if l_name = 'Admin' then
        dbms_output.put_line('Пользователь админ');
    elsif l_name = 'Alex' then
        dbms_output.put_line('Пользователь Alex');
    elsif l_name = 'Kat' then
        dbms_output.put_line('Пользователь Kat');
    else
        dbms_output.put_line('Неизвестный пользователь');
    end if;
end;
/
```

Вывод на экран:

    Неизвестный пользователь

Использование elsif позволяет выполнить еще одну проверку условия в том
случае, если предыдущее условие было ложным. В самом конце добавлен
`else` - код в этом блоке будет выполнен только в том случае, когда ни
одно из предыдущих условий в `if` не было истинным, но он может и
отсутствовать.
