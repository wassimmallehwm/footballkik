module.exports = function(io, Users) {
    const users = new Users();
    io.on('connection', (socket) => {

        socket.on('join', (params, callback) => {
            socket.join(params.room);
            users.addUserData(socket.id, params.name, params.room);
            io.to(params.room).emit('usersList', users.getUsersList(params.room));
            callback();
        });

        socket.on('createMessage', (data, callback) => {
            io.to(data.room).emit('newMessage', {
                text: data.text,
                room: data.room,
                from: data.from
            });
            callback();
        });

        socket.on('disconnect', () => {
            var user = users.removeUser(socket.id);

            if(user){
                io.to(user.room).emit('usersList', users.getUsersList(user.room));
            }
        })
    });
}