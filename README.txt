This application lets the user create and manipulate a list of users. This list is persistent and stored on the Dursley SQL server.

Usage:
    - New user
        - Enter a username and password in the upper left input boxes and click register
        - If the user was added to the database, there is a message saying the user was added

    - Login/Validate existing user
        - Enter a username and password in the upper left input boxes and click login
        - A notification message lets you know if it was a valid combination or not

    - Password updating
        - Enter a username for the user you want to update the password for in the middle left text boxes
        - Enter the new password for that user
        - Click update password
        - A message will tell you if the password change went through or not

    - Deleting users
        -  Type in the username of the user you want to delete in the lower left text box
        - Click the delete user button
        - A notification message will pop up saying if it was successful or not

    -Get user list
        - Click the get users button to get a list of users currently in the database
        - This has to be pressed after every database alteration

To run the program:
    - Extract the submitted .tar file to a folder
    - In that folder, run `flask run --host=0.0.0.0 --port=17025`
    - Navigate to http://cis3210.socs.uoguelph.ca:17025 to access the project
