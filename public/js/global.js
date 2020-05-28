$(document).ready(function(){
    var socket = io();
    const room = "GlobalRoom";
    const name = $('#user-name').val();
    const img = $('#user-image').val();
    socket.on('connect', function() {
        var params = {
            room: room,
            name: name,
            img: img
        };
        socket.emit('globalRoom', params);
    });

    socket.on('loggedInUser', function(users){
        var friends = $('.friend').text();
        var friend = friends.split('@');

        var ol = $('<div></div>');
        var arr = [];
        for(var i = 0; i < users.length; i++){
            if(friends.indexOf(users[i].name) != -1){
                arr.push(users[i]);
                var list = '<img src="https://placehold.it/300x300" class="pull-left img-circle" ' +
                'style="width:50px; margin-right:10px" /><p>' +
                '<a id="val" href="/chat"> <h3 style="padding-top: 15px; color:gray; font-size:16px;">@' +
                users[i].name + '<span class="fa fa-circle online_friend"> </span></h3> </a> </p>'
                ol.append(list)
            }
        }

        $('#numOfFriends').text('(' + arr.length + ')');
        $('.onlineFriends').html(ol);
    })
});