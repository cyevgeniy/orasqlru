---
Title: "Анонимные блоки"
weight: 1
---

Любой PL/SQL код, состоит из блоков. Для начала рассмотрим анонимные
блоки. Их структура следующая:

    DECLARE
        
    BEGIN
        
    END;

Секция объявления переменных является необязательной и может
отсутствовать. В таком случае анонимный блок представляет собой блок
вида:

    BEGIN
        
    END;