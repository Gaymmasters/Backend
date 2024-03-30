# API
## UserRoutes
    (Пример пользователя)
    User = {
        id: 12345,
        email: "test@gmail.com",
        login: "test",
        password: "1111",
        skin: 0
    }
    
    Регистрирование пользователя(Необходимые данные: email, login, password)
    post --> api/registration
    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""}
    При возникновение какой-либо ошибки может не вернуть refreshToken/accessToken
    
    Логин пользователя(Необходимые данные: email, password)
    post --> api/login
    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""}
    При возникновение какой-либо ошибки может не вернуть refreshToken/accessToken

    Логаут пользователя
    post --> api/logout
    Возвращает {message: "", result: true/false}

    Рефреш токена пользователя
    get --> api/refresh
    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""}
    При возникновение какой-либо ошибки может не вернуть refreshToken/accessToken 

    Получение данных всех пользователей
    get --> api/user
    Возвращает Array[{}, {}, ]
    
    Получение данных конкретного пользователя по id(api/user/14234)
    get --> api/user/:id
    Возвращает {...User, message: "", result=true/false}
    При возникновение какой-либо ошибки может не вернуть ...User
    
    Изменение данных конкретного пользователя
    put --> api/user/:id
    Возвращает {...User, message: "", result=true/false}
    При возникновение какой-либо ошибки может не вернуть ...User

    Удаление данных конкретного пользователя
    delete --> api/user/:id
    Возвращает {...User, message: "", result=true/false}
    При возникновение какой-либо ошибки может не вернуть ...User
