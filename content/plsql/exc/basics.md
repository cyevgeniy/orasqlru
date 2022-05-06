---
Title: "Обработка ошибок в PL/SQL"
weight: 1
---

## EXCEPTION блок

Обработка ошибок производится в блоке `exception`:

```sql
begin
	-- Код
exception
	-- Обработка ошибок
	when .... then .....;
	when .... then .....;
	when .... then .....;
end;
```

Ошибки отлавливаются в пределах блока `begin-end`. Работает это так:

1. Сначала выполняется код между `begin` и `exception`
2. Если ошибок не произошло, тогда секция между `exception` и `end` ингорируется
3. Если в процессе выполнения кода происходит ошибка, выполнение останавливается
   и переходит в блок `exception`.
4. Если в блоке находится обработчик для исключения, вызывается код после `then`
5. Если обработчик не найден, исключение выбрасывается за пределы блока `begin-end`

Блок `exception` имеет следующу структуру:

```sql
declare
    l_val number;
begin
    select 1 into l_var
    where 2 > 3;
exception
    when no_data_found then
        dbms_output.put_line('Нет данных');
    when dup_val_on_index then
        dbms_output.put_line('Такая строка уже есть');
end;
```

## Предопределённые ошибки 

Ошибки обрабатываются по их имени, поэтому часть наиболее частых ошибок в PL/SQL
уже предопределена, как например вышеуказанные `no_data_found` и `dup_val_on_index`.

Ниже показан их список и в каких случаях ошибка может возникнуть.

| Ошибка | Когда возникает|
|-|-|
|ACCESS_INTO_NULL |Your program attempts to assign values to the attributes of an uninitialized (atomically null) object.|
|CASE_NOT_FOUND |None of the choices in the WHEN clauses of a CASE statement is selected, and there is no ELSE clause. |
|COLLECTION_IS_NULL| Your program attempts to apply collection methods other than EXISTS to an uninitialized (atomically null) nested table or varray, or the program attempts to assign values to the elements of an uninitialized nested table or varray.|
|CURSOR_ALREADY_OPEN |Попытка открыть уже открытый курсор. Курсор должен быть закрыт до момента его открытия. Цикл FOR автоматически открывает курсор, который использует, поэтому его нельзя открывать внутри тела цикла.|
|DUP_VAL_ON_INDEX |Попытка вставить в таблицу значения, которые нарушают ограничения, созданные уникальным индексом. Иными словами, ошибка возникает, когда в колонки уникального индекса добавляются дублирующие записи.|
|INVALID_CURSOR |Your program attempts an illegal cursor operation such as closing an unopened cursor.|
|INVALID_NUMBER|In a SQL statement, the conversion of a character string into a number fails because the string does not represent a valid number. (In procedural statements, VALUE_ERROR is raised.) This exception is also raised when the LIMIT-clause expression in a bulk FETCH statement does not evaluate to a positive number.|
|LOGIN_DENIED|Попытка подключиться к БД с неправильным логином или паролем.|
|NO_DATA_FOUND|Выражение `SELECT INTO` не возвращает ни одной строки, или программа ссылается на удалённый элемент во вложенной таблице или неинициализированному объекту в ассоциативной таблице. Агрегатные функции в SQL, такие как AVG или SUM, всегда возвращают значение или null. Поэтому, `SELECT INTO`, которое вызывает только агрегатные функции, никогда не выбросит `NO_DATA_FOUND`. Выражение `FETCH` работает так, что ожидает отсутствия строк в определённый момент, поэтому ошибка также не выбрасывается.|
|NOT_LOGGED_ON |Обращение к БД будучи неподключенным к ней|
|PROGRAM_ERROR| Внутренняя проблема в PL/SQL.|
|ROWTYPE_MISMATCH|The host cursor variable and PL/SQL cursor variable involved in an assignment have incompatible return types. For example, when an open host cursor variable is passed to a stored subprogram, the return types of the actual and formal parameters must be compatible.|
|SELF_IS_NULL|Your program attempts to call a MEMBER method on a null instance. That is, the built-in parameter SELF (which is always the first parameter passed to a MEMBER method) is null.|
|STORAGE_ERROR|Переполнение памяти или память повреждена.|
|SUBSCRIPT_BEYOND_COUNT|Your program references a nested table or varray element using an index number larger than the number of elements in the collection.|
|SUBSCRIPT_OUTSIDE_LIMIT|Your program references a nested table or varray element using an index number (-1 for example) that is outside the legal range.|
|SYS_INVALID_ROWID|The conversion of a character string into a universal rowid fails because the character string does not represent a valid rowid.|
|TIMEOUT_ON_RESOURCE|A time-out occurs while Oracle is waiting for a resource.|
|TOO_MANY_ROWS|Выражение `SELECT INTO` возвращает более одной строки.|
|VALUE_ERROR|An arithmetic, conversion, truncation, or size-constraint error occurs. For example, when your program selects a column value into a character variable, if the value is longer than the declared length of the variable, PL/SQL aborts the assignment and raises VALUE_ERROR. In procedural statements, VALUE_ERROR is raised if the conversion of a character string into a number fails. (In SQL statements, INVALID_NUMBER is raised.)|
|ZERO_DIVIDE|Попытка деления на ноль.|

## Определение собственных ошибок

## Ошибки и вложенные блоки


