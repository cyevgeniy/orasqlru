---
Title: "DBMS_OUTPUT.PUT_LINE. Вывод на экран"
weight: 4
toc: false
---

При изучении любого языка программирования очень важно иметь возможность
выводить информацию на экран.

Несмотря на то, что PL/SQL - язык, интегрированный в БД Oracle, он также
имеет возможность вывода информации на экран. Для этого используется
процедура `dbms_output.put_line`.

Пример вызова:

    begin
        dbms_output.put_line('Hello, World');
        dbms_output.put_line(23);
        dbms_output.put_line('Hello, ' || 'World');
        dbms_output.put_line(sysdate);
    end;
    /

Вывод программы:

    Hello, World
    23
    Hello, World
    29-AUG-21

Как видно из примера, `dbms_output.put_line` позволяет выводить строки,
числа и даты - основные типы в Oracle.

Практически все среды разработки поддерживают вывод через dbms_output,
включая [Live SQL](https://livesql.oracle.com).
