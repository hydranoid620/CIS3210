This application lets the user create and manipulate a list of users. This list is persistent and stored on the Dursley SQL server.
There is also functionality to look at and search through a list of mods that are hosted at https://ficsit.app/ (mods for the game Satisfactory).

Usage:
    - Login and Registration
        - Enter a username and password combination
            - If the username and password match, you will be logged in
            - If the username matches but password doesn't, an error will be shown
            - If the username and password don't match an entry in the database, a new user will be created

    - Password updating
        - After logging in, enter a new password in the upper left box and click the accompanying submit button

    - Username changing
        - After logging in, enter a new username in the upper left box and click the accompanying submit button

    - User deletion
        - After logging in, click the red 'Delete Account' button

    - View the table of mod items in the bottom portion of the page
        - Searching
            - Enter a search term in the box on the top right of the table
            - Click the blue 'Search' button and wait a few moments for the API to return a list of mods

        - Resetting the list
            - Click the red 'Clear Search' button on top of the table to clear any searched items in the table and restore the full list

		-Setting number of items
			- Click the dropdown menu at the top right of the table
			- Select the number of items you want to display in the table

		-Downloading a mod
		    - Click the blue download button to the right of the mod you want to download
		    - Mods that are not available for download have their download button disabled

To run the program:
    - Extract the submitted .tar file to a folder
    - In that folder, run `flask run --host=0.0.0.0 --port=17025`
    - Navigate to http://cis3210.socs.uoguelph.ca:17025 to access the project
