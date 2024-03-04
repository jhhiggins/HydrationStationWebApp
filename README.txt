PROJECT ARCHITECTURE:
Important Files:
    1: /client folder:
        1: index.html:
            This is my HTML file, this file loads the default viewport of my webpage, it includes a
            style sheet named style.css, and a script tag that references the module main.js. This
            html is what is loaded upon connecting to my webpage.
        2: main.js:
            This is my main JS file that is loaded into the html as a module. It is used to create
            event listeners for the various buttons that may be displayed on my webpage upon load.
            I have listeners for the following:
                UsernameInput:
                    This listener simply listens for input in the username box and is only used to
                    change the text color back to black after a red error message is displayed when
                    a user enters incorrect credentials or chooses a taken username.
                LoginButton:
                    This event listener listens for when the login button is clicked and calls my
                    login function as seen in section 3
                SignUpTextButton:
                    This event listener is for the small button at the very bottom of the login box
                    that is within the text 'Dont have an account? Sign Up'. When the words Sign Up
                    are clicked, the viewport will be updated with a Sign Up box.
                SidePanelButton:
                    This simply listens for a click and will toggle the display of the side panel.
                SearchBox:
                    This listener will listen for input in the search box and dynamically toggle on
                    or off the visibility of the building grid-items depending on if they contain
                    the search input.
            I then have two main functions for generating the building item display on the main
            content portion of the webpage. The functions are as follows:
                FetchBuildingData:
                    This function will access my json object that contains all the building data I
                    downloaded from the UMASS webpage and store each building and its data as an
                    element in an array.
                GenerateBuildings:
                    This function is responsible for taking the building array data and creating
                    a grid-item element for each, adding event listeners for when they are clicked
                    to display the hydration station info, and then adding them to the grid to be 
                    displayed on the webpage.
            This JS file also has access to my user.js file as seen below via imports
        3. user.js:
            This file is the file where I create my User class/schema to store in my database. A
            user consists of a username, password, and the following data variables for tracking
            various things related to hydration stations:
                A users total refills
                A users amount of plastic bottles saved from landfill
                A users water count, aka how much water they've drank
                A users bottle size
            I have functions that save the current user to local storage for persistence between
            site reloads. This way the user does not have to log in to their account every time
            they reload the page/when they get disconnected. Those functions are:
                SaveToLocalStorage: Saves a user and their data to local storage
                LoadFromLocalStorage: Loads the user and their data from local storage
                ClearLocalStorage: Clears local storage
                CheckSignInStatus: Checks if a user was signed in by seeing if that user is in
                    local storage, and then renders the side panel with that data.
            This file also contains the many CRUD operations, those functions along with others are
            as follows:
                SignUp:
                    This function will allow someone to create a user and store it to local storage
                    and the database. It will check if someone already has that username 
                LogIn:
                    This function allows a user to login to their account using a get request, which
                    then grabs their data, saves it to local storage, and updates the view port
                Refill:
                    This function will update the users data based on their bottle size, update the
                    local storage as well as the database with that new data.
                DeleteUser:
                    This function will communicate with my database through the server via its 
                    specified route and delete the user that is currently logged in.
                SidePanelUpdate:
                    This function will reload the HTML and re-establish the event listeners for the
                    login view of the side panel. This is envoked when a user clicks the logout
                    button.
                Render:
                    This function will take a user and its data, and render the side panel for when
                    a user is signed in. It displays all the information of the users variables, and
                    includes all the interactions a user needs to operate the app.
    2: /server folder:
        1: server.js:
            This is my express server file that starts a server on port 3000 for my webpage. I add
            my client folder route to the express.static in order for my server to load my HTML and
            all other important files upon connection. I then created the following endpoints to
            communicate from the front end to my database. They are as follows:
                /CreateUser: This will pass the user login information as well as the default user 
                variables which will be used to create a user in the database
                /LoginUser: This will pass the user login information through to the database in 
                order to fetch the users data.
                /UsernameCheck: This will pass the user login information to check if a userame is 
                already in use.
                /UpdateUser: This will pass the user login information and the current state of the
                users variables to the database in order to be stored.
                /DeleteUser: This will pass the user login information to search the database for
                that user and delete them from it.
        2: database.js:
            This is my database file that connects to my MongoDB Atlas database in order to store 
            user information. It contains the following functions that link to my CRUD operations:
                GetCollection: This will grab the collection that contains the users in my DB
                CreateUser: This will use the data passed in to create a new user.
                GetUser: This will use the username and password information to grab a user and
                their data.
                UpdateUser: This will use the data passed in to update an existing user's data.
                DeleteUser: This will use the username and password information to remove a user and
                their data from the database.

