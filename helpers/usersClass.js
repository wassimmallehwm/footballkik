class Users {
    constructor(){
        this.users = [];
    }

    addUserData(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    getUsersList(room){
        var users = this.users.filter(u => u.room === room);

        var namesArray = users.map(u => u.name);
        return namesArray;
    }

    getUser(id){
        var usersArr = this.users.filter(u => u.id === id);
        return usersArr[0];
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter(u => u.id != id);
        }
        return user;
    }
}

module.exports = {Users};


