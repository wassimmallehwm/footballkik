module.exports = function(io) {
    io.on('connection', (socket) => {

        socket.on('joinRequest', (data, callback) => {
            socket.join(data.sender);
            callback();
        });

        socket.on('friendRequest', (data, callback) => {

            io.to(data.receiver).emit('newFriendRequest', {
                from: data.sender,
                to: data.receiver
            });

            callback();
        });
    });
}