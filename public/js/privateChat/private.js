$(document).ready(function(){
    var socket = io();

    var param1 = $.deparam(window.location.pathname);
    var paramSplit = param1.split('.');
    var username = paramSplit[0];
    $('#receiver_name').text('@' + username);
    swap(paramSplit, 0, 1);
    var param2 = paramSplit[0] + '.' + paramSplit[1];
    // const room = $('#groupName').val();
    // const sender = $('#sender').val();


    socket.on('connect', function() {
        var params = {
            room1: param1,
            room2: param2
        };

        socket.emit('join private', params);
        socket.on('messageDisplay', function(){
            $('#reload').load(location.href + ' #reload');
        })
    });

    $('#message_form').on('submit', function(event){
        event.preventDefault();
        var msg = $('#msg').val();
        var sender = $('#user-name').val();
        if(msg.trim() != ''){
            socket.emit('privateMessage', {
                text : msg,
                sender: sender,
                room : param1
            }, function(){
                $('#msg').val('');
            });

            $.ajax({
                url : '/chat/' + param1,
                type: 'POST',
                data: {
                    message : msg
                },
                success: function(){
                    $('#msg').val('');
                }
            });
        }
    });

    socket.on('newPrivateMessage', function(data) {
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });

        $('#messages').append(message);
    });



});

function swap(input, val1, val2){
    var temp = input[val1];
    input[val1] = input[val2];
    input[val2] = temp;
}