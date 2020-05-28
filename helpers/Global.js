class Global {
    constructor(){
        this.globalRoom = [];
    }

    enterRoom(id, name, room, img){
        var room = {id, name, room, img};
        this.globalRoom.push(room);
        return room;
    }

    getRoomsList(room){
        var room = this.globalRoom.filter(u => u.room === room);

        var namesArray = room.map(u => {
            return {
                name : u.name,
                img : u.img
            }
        });
        return namesArray;
    }

    getUser(id){
        var usersArr = this.globalRoom.filter(u => u.id === id);
        return usersArr[0];
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.globalRoom = this.globalRoom.filter(u => u.id != id);
        }
        return user;
    }
}

module.exports = {Global};


