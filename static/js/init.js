const messageType = {
    SUCCESS: 1,
    ERROR: 2
}

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
                    setMessage('Account created.', messageType.SUCCESS);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    setMessage('Logged in.', messageType.SUCCESS);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            },
            error: function (jqXHR) {
                if (jqXHR.status === 401) {
                    setMessage('Invalid login entered.', messageType.ERROR)
                } else {
                    setMessage('There was an error with that request. Check the console for details.', messageType.ERROR);
                    console.log(jqXHR);
                }
            }
        });
    });

    //Logout handler
    $('#logout').on('click', function () {
        $.ajax({
            type: 'GET',
            url: 'logout',
            success: function () {
                setMessage('Logged out.', messageType.SUCCESS)
                setTimeout(function () {
                    location.reload();
                }, 1000);
            },
            error: function (jqXHR) {
                setMessage('There was an error with that request. Check the console for details.', messageType.ERROR);
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
                setMessage('Username changed. Reloading page.', messageType.SUCCESS)
                setTimeout(function () {
                    location.reload();
                }, 1500);
            },
            error: function (jqXHR) {
                //Show error message
                setMessage('There was an error with that request. Check the console for details.', messageType.ERROR);
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
                setMessage('Password changed successfully.', messageType.SUCCESS)
            },
            error: function (jqXHR) {
                //Show error message
                setMessage('There was an error with that request. Check the console for details.', messageType.ERROR);
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
                setMessage('Your account was deleted.', messageType.SUCCESS);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            },
            error: function (jqXHR) {
                //Display status message
                setMessage('There was an error with that request. Check the console for details.', messageType.ERROR);
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
            data: JSON.stringify({searchTerm: $("#searchTerm").val(), numItems: $('#numberOfItems').val()}),
            success: function (data) {
                $('#modTable tbody').empty();
                data.forEach(fillTableData);
            },
            error: function (jqXHR) {
                //Display status message
                setMessage('There was an error searching. Check the console for details.', messageType.ERROR);
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
        data: JSON.stringify({numItems: $('#numberOfItems').val()}),
        success: function (data) {
            $('#modTable tbody').empty();
            data.forEach(fillTableData);
        },
        error: function (jqXHR) {
            //Display status message
            setMessage('There was an error building the table. Check the console for details.', messageType.ERROR);
            console.log(jqXHR);
        }
    });
}

function fillTableData(element, index) {
    if (element['versions'].length >= 1) {
        $('#modTable tbody').append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element['name']}</td>
                <td>${element['short_description']}</td>
                <td><a href="https://api.ficsit.app${element['versions'][0]['link']}" class="btn btn-primary">Download</a></td>
            </tr>
        `);
    } else {
        $('#modTable tbody').append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element['name']}</td>
                <td>${element['short_description']}</td>
                <td><a class="btn btn-primary disabled">Download</a></td>
            </tr>
        `);
    }
}

function setMessage(message, type) {
    if (type === messageType.SUCCESS) {
        $('#message').removeClass('text-success')
            .removeClass('text-warning')
            .addClass('text-success')
            .text(message);
    } else if (type === messageType.ERROR) {
        $('#message').removeClass('text-success')
            .removeClass('text-warning')
            .addClass('text-warning')
            .text(message);
    } else {
        console.log("Unknown type: " + type.toString())
        console.log("Message: " + message.toString())
    }
}