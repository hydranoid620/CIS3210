$(function () {
    //Login or register a user
    $("#submitLogin").on("click", function () {
        $.ajax({
            type: 'POST',
            url: 'login',
            contentType: 'application/json',
            data: JSON.stringify({username: $("#usernameInput").val(), password: $("#passwordInput").val()}),
            success: function () {
                $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-success').text('User validated.');
                location.reload();
            },
            error: function (jqXHR) {
                if (jqXHR.status === 401) {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('Invalid login entered.');
                } else {
                    $('#message').removeClass('text-success').removeClass('text-warning').addClass('text-warning').text('There was an error with that request. Check the console for details.');
                    console.log(jqXHR.responseText);
                }
            }
        });
    });

    //Logout handler
    $("#logout").on("click", function() {
        $.ajax({
            type: 'GET',
            url: 'logout',
            complete: function () {
                location.reload();
            }
        });
    });

    //Attempts to update the given user with the new password
    $("#update-password-button").on("click", function () {
        $.ajax({
            url: 'users/' + $('#update-username').val(),
            type: 'PUT',
            dataType: 'application/json',
            data: JSON.stringify({password: $("#update-password").val()}),
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
            }
        });
    });

    //Attempt to delete the user with the entered username
    $("#delete-button").on("click", function () {
        $.ajax({
            url: 'users/' + $('#delete-username').val(),
            type: 'DELETE',
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
            }
        });
    });

    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});

