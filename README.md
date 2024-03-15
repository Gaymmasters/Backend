# API
## UserRoutes
    (Пример пользователя)
    User = {
        id: 12345,
        email: "test@gmail.com",
        login: "test",
        password: "1111",
    }
    
    Регистрирование пользователя(Необходимые данные: email, login, password)
    post --> api/registration
    Возвращает User
    
    Вход пользователя(Необходимые данные: email, password)
    post --> api/login
    Возвращает Obj
    
    Получение данных всех пользователей
    get --> api/user
    Возвращает Array
    
    Получение данных конкретного пользователя по id(api/user/14234)
    get --> api/user/:id
    Возвращает User
    
    Изменение данных конкретного пользователя
    put --> api/user/:id
    Возвращает User
    
    Удаление данных конкретного пользователя
    delete --> api/user/:id
    Возвращает User
