$(function () {
    //Login or register a user
    $('#submitLogin').on('click', function () {
        $.ajax({
            type: 'POST',
            url: 'login',
            contentType: 'application/json',
            data: JSON.stringify({username: $("#usernameInput").val(), password: $("#passwordInput").val()}),
            success: function (data) {
                if (data['newAccount']) {
                    setMessage('Account created.', 1);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    setMessage('Logged in.', 1);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            },
            error: function (jqXHR) {
                if (jqXHR.status === 401) {
                    setMessage('Invalid login entered.', 2)
                } else {
                    setMessage('There was an error with that request. Check the console for details.', 2);
                    console.log(jqXHR);
                }
            }
        });
    });

    //Logout handler
    $('#logout').on('click', function() {
        $.ajax({
            type: 'GET',
            url: 'logout',
            success: function () {
                setMessage('Logged out.', 1)
                setTimeout(function (){
                    location.reload();
                }, 1000);
            },
            error: function (jqXHR) {
                setMessage('There was an error with that request. Check the console for details.');
                console.log(jqXHR)
            }
        });
    });

    //Attempts to update the given user with the new password
    $('#submitUsernameChange').on('click', function () {
        $.ajax({
            url: 'users/' + $('#submitUsernameChange').val(),
            type: 'PUT',
            data: JSON.stringify({change: 'username', username: $("#newUsername").val()}),
            success: function () {
                //Clear input fields
                $('#newUsername').val('');
                //Show success message
                setMessage('Username changed. Reloading page.', 1)
                setTimeout(function (){
                    location.reload();
                }, 1500);
            },
            error: function (jqXHR) {
                //Show error message
                setMessage('There was an error with that request. Check the console for details.', 2);
                console.log(jqXHR);
            }
        });
    });

    //Attempts to update the given user with the new password
    $('#submitPasswordChange').on('click', function () {
        $.ajax({
            url: 'users/' + $('#submitPasswordChange').val(),
            type: 'PUT',
            data: JSON.stringify({change: 'password', password: $("#newPassword").val()}),
            success: function () {
                //Clear input fields
                $('#newPassword').val('');
                //Show success message
                setMessage('Password changed successfully.', 1)
            },
            error: function (jqXHR) {
                //Show error message
                setMessage('There was an error with that request. Check the console for details.', 2);
                console.log(jqXHR);
            }
        });
    });

    //Attempt to delete the user with the entered username
    $('#submitDeleteAccount').on('click', function () {
        $.ajax({
            url: 'users',
            type: 'DELETE',
            success: function () {
                setMessage('Your account was deleted.', 1);
                setTimeout(function (){
                    location.reload();
                }, 1000);
            },
            error: function (jqXHR) {
                //Display status message
                setMessage('There was an error with that request. Check the console for details.', 2);
                console.log(jqXHR);
            }
        });
    });

    //Search mods
    $('#submitSearch').on('click', function () {
        $.ajax({
            url: '/ficsit/search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({searchTerm: $("#searchTerm").val(), numItems: $('#numberOfItems').val() }),
            success: function (data) {
                $('#modTable tbody').empty();
                data.forEach(fillTableData);
            },
            error: function (jqXHR) {
                //Display status message
                setMessage('There was an error searching. Check the console for details.', 2);
                console.log(jqXHR);
            }
        });
    });

    //Reset search
    $("#resetSearch").on("click", function () {
        populateMods()
        $("#searchTerm").val("")
    });

    //Update list when number of items changed
    $('#numberOfItems').on('change', function () {
        populateMods();
    })

    populateMods()
    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});

function populateMods() {
    //Gets data for the table
    $.ajax({
        url: '/ficsit/get_mods',
        type: 'POST',
        data: JSON.stringify({ numItems: $('#numberOfItems').val() }),
        success: function (data) {
            $('#modTable tbody').empty();
            data.forEach(fillTableData);
        },
        error: function (jqXHR) {
            //Display status message
            setMessage('There was an error building the table. Check the console for details.', 2);
            console.log(jqXHR);
        }
    });
}

function fillTableData (element, index) {
    $('#modTable tbody').append(`<tr><th scope='row'>${index + 1}</th><td>${element['name']}</td><td>${element['short_description']}</td></tr>`)
}

function setMessage (message, type) {
    if (type === 1) {
        $('#message').removeClass('text-success')
            .removeClass('text-warning')
            .addClass('text-success')
            .text(message);
    } else {
        $('#message').removeClass('text-success')
            .removeClass('text-warning')
            .addClass('text-warning')
            .text(message);
    }
}