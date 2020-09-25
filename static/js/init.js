$(document).ready(function () {
    //JSONify the username and password text boxes and send to server
    $("#post-button").on("click", function () {
        let object = {
            'username': $("#username").val(),
            'password': $("#password").val()
        };

        $.ajax({
            type: 'POST',
            url: 'user',
            data: object,
            success: function (data, status) {
                //TODO: Display success middle top of main screen
                $('#username').val('');
                $('#password').val('');
            },
            dataType: "json"
        });
    });

    //GET a list of users on the server
    $("#get-button").on("click", function () {
        $.ajax({
            type: 'GET',
            url: 'user',
            success: function (data, status) {
                //TODO: Display success middle top of main screen
                $('#userlist').empty();
                data.users.forEach(function (user) {
                    $('#userlist').append('<option value="'+ user.password +'">' + user.username + '</option>');
                })
            },
            dataType: "json"
        });
    });

    //Set event handler for when selected user is changed, show password
    $("#userlist").change(function () {
        $('#passwordforuser').text($(this).val());
    });


        /*    $.ajax({
                url: 'newurl',
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                }
            });*/

    /*    $.ajax({
            url: 'url',
            type: 'PUT',
            success: function(response) {
                //...
            }
        });*/

    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});

