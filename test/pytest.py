import requests
"""import psycopg2

def execute_query(connection, query):
    connection.autocommit = True
    cursor = connection.cursor()
    cursor.execute(query)
    print("Query executed successfully")

connection = psycopg2.connect(
            database="tictacpostgres",
            user='postgres',
            password='admin',
            host="localhost",
            port="5400",
        )
sql= 
create table "User"(
	"id" bigint,
	"email" text,
	"login" text NOT NULL,
	"password" varchar,
	"skin" int DEFAULT 0,
	primary key ("id")
);
create table "UserToken"(
	"userId" bigint,
	"refreshToken" text,
	foreign key ("userId") references "User" ("id") ON DELETE CASCADE
);

execute_query(connection, sql)
"""
# URL API
base_url = "http://localhost:6000/api"

def test_registration():
    url = f"{base_url}/registration"
    data = {
        "email": "test@gmail.com",
        "login": "test",
        "password": "11111111"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    json_response = response.json()
    id_test = json_response["id"]
    print("ID -", id_test)
    assert json_response["result"]
    assert "accessToken" in json_response
    assert "refreshToken" in json_response
    print("REGISTRATION - OK")
    return id_test

def test_login():
    url = f"{base_url}/login"
    data = {
        "email": "test@gmail.com",
        "password": "11111111"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    assert "accessToken" in json_response
    assert "refreshToken" in json_response
    print("LOGIN - OK")
    cookies = response.cookies
    test_refresh(cookies)

def test_logout():
    url = f"{base_url}/logout"
    response = requests.post(url)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    print("LOGOUT - OK")

def test_refresh(cookies):
    url = f"{base_url}/refresh"
    response = requests.get(url, cookies=cookies)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    assert "accessToken" in json_response
    assert "refreshToken" in json_response
    print("REFRESH - OK")

def test_get_all_users():
    url = f"{base_url}/user"
    response = requests.get(url)
    assert response.status_code == 200
    json_response = response.json()
    assert isinstance(json_response, list)
    print("GET USERS - OK")

def test_get_user_by_id(id):
    user_id = id
    url = f"{base_url}/user/{user_id}"
    response = requests.get(url)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    assert "id" in json_response
    print("GET USER WITH ID - OK")

def test_update_data(id):
    user_id = id
    url = f"{base_url}/user/{user_id}"
    data = {
        "login": "test",
        "password": "11111111",
        "skin": "1"
    }
    response = requests.put(url, json=data)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    print("UPDATE - OK")

def test_delete(id):
    user_id = id
    url = f"{base_url}/user/{user_id}"
    response = requests.delete(url)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["result"]
    print("DELETE - OK")

# Запуск тестов
id = test_registration()
test_login()
test_logout()
test_get_all_users()
test_get_user_by_id(id)
test_update_data(id)
test_delete(id)