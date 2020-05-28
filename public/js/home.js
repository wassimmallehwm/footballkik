$(document).ready(function(){

    $('#favorite').on('submit', function(e){
        e.preventDefault();
        const id = $('#id').val();
        const clubName = $('#clubName').val();
    
        $.ajax({
            url : '/home',
            type: 'POST',
            data: {
                id : id,
                clubName: clubName
            },
            success: function(){
                console.log(clubName);
            }
        })
    })
});