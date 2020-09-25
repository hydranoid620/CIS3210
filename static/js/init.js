$(document).ready(function () {
    //Set event handler for when selected user is changed, show password
    $("#userlist").change(function () {
        $('#passwordforuser').val($(this).val());
    });

    //Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //JSONify the username and password text boxes and send to server
    $("#post-button").on("click", function () {
        let newUser = {
            'username': $("#username").val(),
            'password': $("#password").val()
        };

        $.ajax({
            type: 'POST',
            url: 'user',
            data: newUser,
            success: function () {
                $('#username').val('');
                $('#password').val('');
                $('#message').text('User added to the user list. Press the GET button to get the list.');
            },
            dataType: "json",
        });
    });

    //GET a list of users on the server
    $("#get-button").on("click", function () {
        $.ajax({
            type: 'GET',
            url: 'user',
            success: function (data, status) {
                //Empty and populate the user list
                $('#userlist').empty();
                data.users.forEach(function (user) {
                    $('#userlist').append('<option value="'+ user.password +'">' + user.username + '</option>');
                })

                //Show password for default selected user
                $('#passwordforuser').val($("#userlist").val())

                $('#message').text('' +
                    'User list received from server.\nSelect a user in the User List dropdown, ' +
                    'then you can either edit a user\'s password with the field under the PUT button then press the PUT button, or ' +
                    'you can also delete a user by pressing the DELETE button');
            },
            dataType: "json"
        });
    });

    $("#put-button").on("click", function () {
        $.ajax({
            url: '/user/' + $('#userlist option:selected').text(),
            type: 'PUT',
            data: {'newpassword': $("#newpassword").val()},
            success: function () {
                //Update displayed password
                $('#newpassword').val('');
                $('#passwordforuser').val('');
                $('#userlist').empty();

                $('#message').text('User edited. Press the GET button to get the updated user list.');
            },
            dataType: "json"
        });
    });

    $("#delete-button").on("click", function () {
        $.ajax({
            url: '/user/' + $('#userlist option:selected').text(),
            type: 'DELETE',
            data: {},
            success: function () {
                //TODO: Display warning saying you need to GET the list
                $('#newpassword').val('');
                $('#passwordforuser').val('');
                $('#userlist').empty();

                $('#message').text('User deleted. Press the GET button to get the updated user list.');
            },
            dataType: "json"
        });
    });


    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});

