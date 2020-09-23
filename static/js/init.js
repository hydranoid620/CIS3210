$(document).ready(function () {
    $("#post-button").on("click", function () {
        let object = {"message": "Hello from JavaScript!"}
        console.log("Making POST request with object: \n" + JSON.stringify(object))

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

    console.log("Name: Nicholas Rosati\nStudent Number: 1037025");
});
