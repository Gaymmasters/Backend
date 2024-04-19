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

    Рефреш токена пользователя (Требуется чтобы refreshToken был сохранен в Cookie)
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

    (Пример игры)
    Game = {
        id: 12345,
        player1Id: 111111,
        player2Id: 222222,
        winflag: 0,
        password: 'abcd',
        moves: ['A4', 'B5', ...],
        name: "My game",
        isPrivate: true
    }

    Получение списка игр
    get --> api/game
    Возвращает [{}, {}, ...]

    Получение данных об конкретной игре по id
    get --> api/game/:id
    Возвращает {...game, message: "Success", result: true}

    Создание игры(Необходимые данные: id, name, isPrivate, password, player1Id)
    post --> api/create
    Возвращает {...game, message: "Game has been successfully created", result: true}
    
    Подключение к созданной игре(Необходимые данные: player2Id, name, password(Может быть null))
    put --> api/join
    Возвращает {...game, message: "You have been successfully joined the game", result: true}

    Получение списка ходов конкретной игры
    get --> api/moves/:id
    Возвращает ['A5', 'G6', ...]

    Добавление хода в массив ходов(Необходимые данные: id, move) move = 'A5'
    post --> api/makemove
    Возвращает {...game, message: "Move has been recorded", result: true}

    Меняет флаг победы(Необходимые данные: id, winFlag)
    put --> api/flagwinner
    Возвращает {...game, message: "Winner has been flagged", result: true}


