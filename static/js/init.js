$(document).ready(function () {
    $("#post-button").on("click", function () {
        let object = {"message": "Hello from JavaScript!"}
        $.ajax({
            type: "POST",
            url: "user",
            data: object,
            success: function (data, status) {alert("Data: " + data.message + "\nStatus: " + status);},
            dataType: "json"
        })
    });

    $("#get-button").on("click", function () {
        console.log("Making GET request")
        $.get("user", function (data, status){
            alert("Data: " + data.message + "\nStatus: " + status);
        });
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
