$(document).ready(function(){
    var socket = io();

    const room = $('#groupName').val();
    const sender = $('#sender').val();

    socket.on('connect', function(){
        var params = {
            sender: sender
        }
        socket.emit('joinRequest', params, function(){
            console.log('JOIN EVENT');
        })
    });

    socket.on('newFriendRequest', (data) => {
        $('#reload').load(location.href + ' #reload');

        $(document).on('click', '#accept_friend', function(e){
            e.preventDefault();
    
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
    
            $.ajax({
                url : '/group/' + room,
                type: 'POST',
                data: {
                    senderId : senderId,
                    senderName : senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        })

        $(document).on('click', '#cancel_friend', function(e){
            e.preventDefault();
    
            var cancelId = $('#cancelId').val();
    
            $.ajax({
                url : '/group/' + room,
                type: 'POST',
                data: {
                    cancelId : cancelId
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
        })
    })
    
    $('#add_friend').on('submit', function(e){
        e.preventDefault();

        var receiverName = $('#receiverName').val();

        $.ajax({
            url : '/group/' + room,
            type: 'POST',
            data: {
                receiver : receiverName
            },
            success: function(){
                socket.emit('friendRequest', {
                    receiver : receiverName,
                    sender : sender
                }, function(){
                    console.log('Request sent !');
                })
            }
        })
    })

});