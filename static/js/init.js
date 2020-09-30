$(function () {
    //Register a new user
    $("#register-button").on("click", function () {
        $.ajax({
            type: 'POST',
            url: 'register',
            data: {
                'username': $("#username").val(), //TODO: INPUT SANITIZATION
                'password': $("#password").val() //TODO: INPUT SANITIZATION
            },
            success: function () {
                $('#username').val('');
                $('#password').val('');
                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User added to the user list. User list must be updated.');
            },
            error: function (jqXHR) {
                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('There was an error registering the user. Check the console for details.');
                console.log(jqXHR.responseText);
            },
            dataType: "json",
        });
    });

    //'Login' a user
    $("#login-button").on("click", function () {
        $.ajax({
            type: 'POST',
            url: 'login',
            data: {
                'username': $("#username").val(), //TODO: INPUT SANITIZATION
                'password': $("#password").val() //TODO: INPUT SANITIZATION
            },
            success: function () {
                $('#username').val('');
                $('#password').val('');
                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User validated.');
            },
            error: function (jqXHR) {
                if (jqXHR.status === 404) {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('Could not find a user with that username. Try registering instead.');
                } else {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('There was an error with that request. Check the console for details.');
                    console.log(jqXHR.responseText);
                }
            },
            dataType: "json",
        });
    });

    //Gets the list of existing users
    $("#get-users-button").on("click", function () {
        $.ajax({
            type: 'GET',
            url: 'users',
            success: function (data) {
                //Empty and populate the user list
                $('#user_list').empty();
                data.forEach(function (user) { //TODO: Test the indexer, it should work but idk
                    $('#user_list').append('<option value="'+ user.username +'">' + user.username + '</option>');
                })

                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User list updated.');
            },
            dataType: "json"
        });
    });

    //Attempts to update the given user with the new password
    $("#update-password-button").on("click", function () {
        $.ajax({
            url: 'users/' + $('#update-username').val(),
            type: 'PUT',
            data: {'password': $("#update-password").val()}, //TODO: INPUT SANITIZATION
            success: function () {
                //Clear input fields
                $('#update-username').val('');
                $('#update-password').val('');

                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User password updated.');//Display status message
            },
            error: function (jqXHR) {
                if (jqXHR.status === 404) {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('Could not find a user with that username to update.');
                } else {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('There was an error with that request. Check the console for details.');
                    console.log(jqXHR.responseText);
                }
            },
            dataType: "json"
        });
    });

    //Attempt to delete the user with the entered username
    $("#delete-button").on("click", function () {
        $.ajax({
            url: 'users/' + $('#delete-username').val(), //TODO: INPUT SANITIZATION
            type: 'DELETE',
            data: {},
            success: function () {
                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User deleted. User list must be updated.'); //Display status message
            },
            error: function (jqXHR) {
                //Display status message
                if (jqXHR.status === 404) {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('Could not find a user with that username to delete.');
                } else {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('There was an error with that request. Check the console for details.');
                    console.log(jqXHR.responseText);
                }
            },
            dataType: "json"
        });
    });


    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});

