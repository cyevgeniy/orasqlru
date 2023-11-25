---
Title: "Вхождение в диапазон. BETWEEN. NOT BETWEEN"
weight: 10
toc: false
---

# Вхождение в диапазон. `BETWEEN`. `NOT BETWEEN`

`BETWEEN` используется для того, чтобы проверить значение на вхождение в
диапазон. Проверять вхождение в диапазон значений можно строки, числа и
даты.

Пример №1: Получить список блюд, рейтинг которых колеблется от 270 до
320 включительно:

    select d.*
    from dishes d
    where rating between 270 and 320

![](/img/3_select/rating_between_270_320.png)

Следует помнить, что граничные значения диапазона всегда включаются при
проверке, т.е. этот запрос идентичен следующему:

    select d.*
    from dishes d
    where d.rating ≥ 270
    and d.rating ≤ 320

Пример №2: Получить список блюд, рейтинг которых колеблется от 270 до
320, и стоимость которых от 1 до 6:

    select d.*
    from dishes d
    where d.rating between 270 and 320
    and d.price between 1 and 6

![](/img/3_select/rating_btw_270_320_price_btw_1_6.png)

Пример №3: Получить список блюд с рейтингом, значения которого не входят
в диапазон чисел от 270 до 320:

    select d.*
    from dishes d
    where d.rating not between 270 and 320

![](/img/3_select/rating_not_btw_270_320.png)

Здесь для того, чтобы исключить значения из диапазона, перед \`between\`
было добавлено ключевое слово `NOT`.
