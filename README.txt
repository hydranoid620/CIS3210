This application lets the user create and manipulate a list of users. This list gets reset every time the server is restarted.
Very brief descriptions of the four buttons are on tooltips but more descriptive descriptions are here:
    - POST
        - Sends a new user (with user entered username and password) to the server to add it to the server's user list
    - GET
        - Gets the user list from the server and puts it into a selectable list
    - PUT
        - Updates the selected user's password with the password in the New Password box
        - The user list and password fields are emptied when this is done and the suer has to GET the list again
    - DELETE
        - Deletes the selected user from the server's user list
        - The user list and password fields are emptied when this is done and the suer has to GET the list again

*NOTE*
There isn't any input validation for the password or username fields. That felt out of scope for the lab.

To run the program:
    - Extract the submitted .tar file to a folder
    - In that folder, run `flask run --host=0.0.0.0 --port=17025`
    - Navigate to http://cis3210.socs.uoguelph.ca:17025 to access the project
