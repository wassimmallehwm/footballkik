module.exports = function(io, Global, _) {
    const clients = new Global();
    io.on('connection', (socket) => {


        socket.on('globalRoom', (params) => {
            socket.join(params.room);
            clients.enterRoom(socket.id, params.name, params.room, params.img);
            var nameProp = clients.getRoomsList(params.room);
            const arr = _.uniqBy(nameProp, 'name');

            io.to(params.room).emit('loggedInUser', arr);
        });

        socket.on('disconnect', () => {
            var user = clients.removeUser(socket.id);

            if(user){
                var userData = clients.getRoomsList(user.room);
                const arr = _.uniqBy(userData, 'name');
                const removeData = _.remove(arr, {'name' : user.name});
                io.to(user.room).emit('loggedInUser', arr);
            }
        })



    });
}