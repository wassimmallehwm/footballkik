$(document).ready(function(){
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });

    $('#upload-input').on('change', function(){
        var uploadInput = $('#upload-input');
        if(uploadInput.val() != ''){
            var formData = new FormData();
            formData.append('upload', uploadInput[0].files[0])

            $.ajax({
                url : '/uploadFile',
                type : 'POST',
                data : formData,
                processData: false,
                contentType: false,
                success : function(){
                    uploadInput.val('');
                }
            })
        }
    });

    // $('#add-club').on('click', function(){
    //     var club = $('#club');
    //     var country = $('#country');
    //     var upload = $('#upload-input');
    //     var newClub = {
    //         club : club,
    //         country : country,
    //         upload : upload
    //     };

    //     $.ajax({
    //         url : '/dashboard',
    //         type : 'POST',
    //         data : newClub,
    //         processData: false,
    //         contentType: false,
    //         success : function(){
    //             club.val('');
    //             country.val('');
    //             upload.val('');
    //         }
    //     })
    // });
})