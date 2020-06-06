module.exports = function(io) {
    io.on('connection', (socket) => {

        socket.on('join private', (params) => {

            socket.join(params.room1);
            socket.join(params.room2);
        })

        socket.on('privateMessage', (data, callback) => {
            io.to(data.room).emit('newPrivateMessage', {
                text: data.text,
                sender: data.sender
            })
            io.to(data.room).emit('messageDisplay', {})
            callback();
        })
        // socket.on('disconnect', () => {
        //     var user = users.removeUser(socket.id);

        //     if(user){
        //         io.to(user.room).emit('usersList', users.getUsersList(user.room));
        //     }
        // })
    });
}