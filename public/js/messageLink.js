$(document).ready(function(){

    var socket = io();

    var param1 = $.deparam(window.location.pathname);
    var paramSplit = param1.split('.');
    swap(paramSplit, 0, 1);
    var param2 = paramSplit[0] + '.' + paramSplit[1];
    const id = $('#chatId').val();


    socket.on('connect', function() {
        var params = {
            room1: param1,
            room2: param2
        };

        socket.emit('join private', params);
    });

    $($document).on('click', '#messageLink', function(e){
        e.preventDefault();
        const chatId = $(this).data().value;
    
        $.ajax({
            url : '/chat/' + param1,
            type: 'POST',
            data: {
                chatId : chatId
            },
            success: function(){
                console.log(clubName);
            }
        })
    })
});