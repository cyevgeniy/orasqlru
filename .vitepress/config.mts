import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Orasql.ru",
  description: "Учебник по SQL и PL/SQL",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'SQL', link: '/sql/' },
      { text: 'PL/SQL', link: '/plsql/' }
    ],

    sidebar: {
      '/sql': [
        {
            text: 'Введение',
            items: [
            { text: 'Введение в SQL', link: '/sql/intro/sqlintro/' },
            { text: 'DDL, DML', link: '/sql/intro/ddldml/' },
            { text: 'Выполнение SQL. Облачные сервисы', link: '/sql/intro/sqlcloud/' },
            { text: 'Инструменты для работы с БД Oracle', link: '/sql/intro/instruments/' },
            { text: 'Ссылки на полезные ресурсы', link: '/sql/intro/links/' },
            ]
        },
        {
            text: 'Основы',
            items: [
            { text: 'Таблицы', link: '/sql/basics/tables/' },
            { text: 'Основные типы данных', link: '/sql/basics/maintypes/' },
            { text: 'Пример SELECT запроса', link: '/sql/basics/selectstruct/' },
            { text: 'Написание SQL- кода', link: '/sql/basics/scripts/' },
            { text: 'Сортировка результатов. Order by', link: '/sql/basics/orderby/' },
            { text: 'Оператор WHERE. Операторы сравнения', link: '/sql/basics/comparison/' },
            { text: 'Проверка нескольких условий. AND, OR', link: '/sql/basics/andor/' },
            { text: 'Проверка значения на NULL', link: '/sql/basics/isnull/' },
            { text: 'IN, NOT IN', link: '/sql/basics/innotin/' },
            { text: 'Вхождение в диапазон. BETWEEN. NOT BETWEEN', link: '/sql/basics/between/' },
            { text: 'Соединения таблиц', link: '/sql/basics/joins/' },
            { text: 'Древовидные структуры данных. Рекурсивные запросы', link: '/sql/basics/recursive/' },
            { text: 'Подзапросы в Oracle', link: '/sql/basics/subqueries/' },
            { text: 'Exists. Наличие строк в подзапросе', link: '/sql/basics/exists/' },
            { text: 'Subquery factoring. WITH', link: '/sql/basics/with/' },
            ]
        },
        {
          text: "Работа с множествами",
          items: [
            { text: 'Объединение. UNION', link: '/sql/sets/unions/' },
            { text: 'Разница запросов. MINUS', link: '/sql/sets/minus/' },
            { text: 'Пересечение запросов', link: '/sql/sets/intersect/' },
            { text: 'Общая информация', link: '/sql/sets/sets/' },
          ],
        },
        {
          text: "Стандартные функции",
          items: [
            { text: 'Функции для работы со строками', link: '/sql/standfunc/stringfunctions/' },
            { text: 'Функции для работы с NULL', link: '/sql/standfunc/nullfunctions/' },
            { text: 'Условные функции', link: '/sql/standfunc/conditional/' },
            { text: 'Битовые операции', link: '/sql/standfunc/bit/' },
            { text: 'Агрегирующие функции', link: '/sql/standfunc/aggregation/' },
            { text: 'Работа с датами в Oracle', link: '/sql/standfunc/datefunctions/' },
            { text: 'Аналитические функции', link: '/sql/standfunc/analytics/' },
            { text: 'Distinct. Удаление дубликатов', link: '/sql/standfunc/distinct/' },
          ],
        },
      {
          text: "DML. Изменение данных и структуры БД",
          items: [
            { text: 'Оператор INSERT', link: '/sql/dml/dmlinsert/' },
            { text: 'Изменение данных. UPDATE', link: '/sql/dml/dmlupdate/' },
            { text: 'Удаление данных. DELETE', link: '/sql/dml/dmldelete/' },
            { text: 'Слияние данных. MERGE', link: '/sql/dml/dmlmerge/' },
            { text: 'Изменение структуры таблицы. ALTER TABLE', link: '/sql/dml/dmlaltertable/' },
          ],
        },
        {
          text: "Объекты БД",
          items: [
            { text: 'Первичные ключи', link: '/sql/dbobjects/primarykeys/' },
            { text: 'Внешние ключи', link: '/sql/dbobjects/foreignkeys/' },
            { text: 'Уникальные ключи', link: '/sql/dbobjects/uniquekeys/' },
            { text: 'Представления', link: '/sql/dbobjects/views/' },
            { text: 'Индексы', link: '/sql/dbobjects/indexes/' },
            { text: 'Виртуальные колонки', link: '/sql/dbobjects/virtualcolumns/' },
            { text: 'Псевдостолбцы в Oracle', link: '/sql/dbobjects/pseudocolumns/' },
          ],
        },
        {
          text: "Транзакции",
          items: [
            { text: 'Транзакции в Oracle', link: '/sql/transactions/transactions/' },
          ],
        },
      ],
      '/plsql': [
        {
          text: "Введение",
          items: [
           { text: "Что такое PL/SQL", link: '/plsql/intro/plsql_intro/' },
           { text: "Когда использовать PL/SQL", link: '/plsql/intro/plsql_whentouse/' },
          ],
        },
        {
          text: "Основы PL/SQL",
          items: [
           { text: "Анонимные блоки", link: '/plsql/basics/plsql_anonymous_block/' },
           { text: "Вложенные и именованные блоки", link: '/plsql/basics/plsql_blocks/' },
           { text: "Первая программа на PL/SQL", link: '/plsql/basics/plsql_first_program/' },
           { text: "DBMS_OUTPUT.PUT_LINE. Вывод на экран", link: '/plsql/basics/plsql_dbms_put_line/' },
           { text: "Переменные, константы. Простые типы данных", link: '/plsql/basics/plsql_simpletypes/' },
           { text: "Условное ветвление. If...else...elsif", link: '/plsql/basics/plsql_ifelse/' },
           { text: "Схема БД. Её объекты", link: '/plsql/basics/plsql_schema/' },
           { text: "Функции в PL/SQL", link: '/plsql/basics/plsql_functions/' },
           { text: "Процедуры в PL/SQL", link: '/plsql/basics/plsql_procedures/' },
           { text: "Взаимодействие PL/SQL и SQL. Переключение контекста", link: '/plsql/basics/context/' },
           { text: "Пакеты", link: '/plsql/basics/packages/' },
           { text: "Циклы в PL/SQL", link: '/plsql/basics/loops/' },
          ],
        },
        {
          text: "Обработка ошибок",
          items: [
           { text: "Обработка ошибок в PL/SQL", link: '/plsql/exc/basics/' },
          ]
        },
        {
          text: "Взаимодействие с данными",
          items: [
           { text: "Взаимодействие SQL и PL/SQL", link: '/plsql/sql/selectinto/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cyevgeniy/orasqlru' }
    ],
    docFooter: {
      prev: 'Назад',
      next: 'Далее'
    },
    outline: {
      label: 'На этой странице'
    }
  }
})
