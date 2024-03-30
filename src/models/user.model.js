class User {
    constructor(id, email, login, password, skin=0){
        this.id = id;
        this.email = email;
        this.login = login;
        this.password = password;
        this.skin = skin;
    }
}
export default User;