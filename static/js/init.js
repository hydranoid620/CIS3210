$(document).ready(function () {
    //Sets animations for the buttons
    clippy.load('Links', function(agent) {
        agent.show();

        $("#greeting-button").on("click", function() {agent.play("Greeting")});
        $("#artsy-button").on("click", function() {agent.play("GetArtsy")});
        $("#alert-button").on("click", function() {agent.play("Alert")});

        $("#wave-button").on("click", function() {agent.play("Wave")});
        $("#save-button").on("click", function() {agent.play("Save")});
        $("#print-button").on("click", function() {agent.play("Print")});

        $("#get-wizardy-button").on("click", function() {agent.play("Get Wizardy")});
        $("#congratulate-button").on("click", function() {agent.play("Congratulate")});
        $("#empty-trash-button").on("click", function() {agent.play("Empty Trash")});

        $("#stop-current-button").on("click", function() {agent.stopCurrent()});
        $("#stop-all-button").on("click", function() {agent.stop()});
    });
});