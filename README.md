# API
## Start
> [!NOTE]
> Для того, чтобы запустить сервер нужно перейти в папку src \
    `cd src` \
> Затем установить необходимые зависимости \
    `npm i` \
> Теперь можно запустить сервер в обычном режиме \
    `npm start` \
> Или в режиме разработки \
    `npm run dev`

---
### Routes

#### UserRoutes
(Пример пользователя)

    User = {
        id: 12345,
        email: "test@gmail.com",
        login: "test",
        password: "1111",
        skin: 0
    }
    
>[!IMPORTANT]
> Роуты пользователя
> * Регистрирование пользователя(Необходимые данные: email, login, password) \
>    `post --> api/registration` \
>    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""} 
>    
> * Логин пользователя(Необходимые данные: email, password) \
>    `post --> api/login` \
>    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""} 
>
> * Логаут пользователя \
>    `post --> api/logout` \
>    Возвращает {message: "", result: true/false} 
>
> * Рефреш токена пользователя (Требуется чтобы refreshToken был сохранен в Cookie) \
>    `get --> api/refresh` \
>    Возвращает {...User, message: "", result: true/false, refreshToken: "", accessToken: ""} 
>
> * Получение данных всех пользователей \
>    `get --> api/user` \
>    Возвращает Array[{}, {}, ] 
>    
> * Получение данных конкретного пользователя по id(api/user/14234) \
>    `get --> api/user/:id` \
>    Возвращает {...User, message: "", result=true/false} 
>    
> * Изменение данных конкретного пользователя \
>   `put --> api/user/:id` \
>    Возвращает {...User, message: "", result=true/false} 
>
> * Удаление данных конкретного пользователя \
>    `delete --> api/user/:id` \
>    Возвращает {...User, message: "", result=true/false} 
>
---
#### GameRoutes
(Пример игры)

    Game = {
        id: 12345,
        player1Id: 111111,
        player2Id: 222222,
        winflag: 0,
        password: 'abcd',
        moves: ['b4s6', 'b6s1', ...],
        name: "My game",
        isPrivate: true,
        isBot: false
    }
>[!IMPORTANT]
> Роуты игры
> * Получение списка игр \
>    `get --> api/game` \
>    Возвращает [{}, {}, ...] 
>
> * Получение списка активных(Игр с одним игроком) игр \
>    `get --> get/game/active` \
>    Возвращает [{}, {}, ...] 
>
> * Получение данных об конкретной игре по id \
>    `get --> api/game/:id` \
>    Возвращает {...game, message: "Success", result: true} 
>
> * Удаление данных об конкретной игре по id \
>    `delete --> api/game/:id` \
>    Возвращает {...game, message: "Game has been successfully deleted", result true} 
>
> * Создание игры(Необходимые данные: id, name, isPrivate, password, player1Id) \
>    `post --> api/create` \
>    Возвращает {...game, message: "Game has been successfully created", result: true} 
>    
> * Подключение к созданной игре(Необходимые данные: player2Id, name, password(Может быть null)) \
>    `put --> api/join` \
>    Возвращает {...game, message: "You have been successfully joined the game", result: true} 
>
> * Получение списка ходов конкретной игры \
>    `get --> api/moves/:id` \
>    Возвращает ['b4s3', 'b3s5', ...] 
>
> * Добавление хода в массив ходов(Необходимые данные: id, move) move == 'b4s5' \
>    `post --> api/makemove` \
>    Возвращает {...game, message: "Move has been recorded", result: true} 
>
> * Меняет флаг победы(Необходимые данные: id, winFlag) \
>    `put --> api/flagwinner` \
>    Возвращает {...game, message: "Winner has been flagged", result: true} 
