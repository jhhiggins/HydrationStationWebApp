class User {
    constructor() {
        this.username = '';
        this.password = '';
        this.totalRefills = parseInt(0);
        this.bottleSize = 16;
        this.waterCount = parseInt(0);
        this.plasticBottlesSaved = parseFloat(0);
    }

    // Save user information to local storage
    saveToLocalStorage() {
        localStorage.setItem('user', JSON.stringify({
            username: this.username,
            password: this.password,
            totalRefills: this.totalRefills,
            bottleSize: this.bottleSize,
            waterCount: this.waterCount,
            plasticBottlesSaved: this.plasticBottlesSaved,
        }));
    }

    // Load user information from local storage
    loadFromLocalStorage() {
        const userData = localStorage.getItem('user');
        if (userData) {
            const data = JSON.parse(userData);
            this.username = data.username;
            this.password = data.password;
            this.totalRefills = data.totalRefills;
            this.bottleSize = data.bottleSize;
            this.waterCount = data.waterCount;
            this.plasticBottlesSaved = data.plasticBottlesSaved;
        }
    }

    clearLocalStorage() {
        const userData = localStorage.getItem('user');
        if(userData) {
            localStorage.clear();
        }
    }

    //create function for signup username and password
    async signUp(name, pass) {
        //check if username already exists
        try {
            const response = await fetch(`/usernameCheck?username=${name}&password=${pass}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                document.getElementById('username').value = 'Credentials Taken!!!';
                document.getElementById('username').style.color = 'maroon';
                document.getElementById('username').style.fontWeight = 'bold';

                document.getElementById('password').value = '';
            } else {
                this.username = name;
                this.password = pass;
                this.totalRefills = 0;
                this.bottleSize = 16;
                this.waterCount = 0;
                this.plasticBottlesSaved = 0;

                this.saveToLocalStorage();
                user.render();

                try {
                    const response = await fetch('/createUser', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: this.username,
                            password: this.password,
                            totalRefills: this.totalRefills,
                            bottleSize: this.bottleSize,
                            waterCount: this.waterCount,
                            bottleSaved: this.plasticBottlesSaved
                        }),
                    });
                    if(!response.ok){
                        throw new Error(`Error! Status: ${response.status}`);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {}
    }

    //read function to grab user on login
    async login(username, password) {
        try {
            const response = await fetch(`/loginUser?username=${username}&password=${password}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
    
                //set user data to the response data
                this.username = data.user.username;
                this.password = data.user.password;
                this.totalRefills = data.user.totalRefills;
                this.bottleSize = data.user.bottleSize;
                this.waterCount = data.user.waterCount
                this.plasticBottlesSaved = data.user.bottleSaved;
    
                this.saveToLocalStorage();
                this.render();
            } else {
                document.getElementById('username').value = 'Account Not Found!';
                document.getElementById('username').style.color = 'maroon';
                document.getElementById('username').style.fontWeight = 'bold';

                document.getElementById('password').value = '';
                throw new Error(`Error! Status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    //refill funciton aka undate
    async refill() {
        try {
            // this.username = name;
            // this.password = pass;

            //calculate the users new values
            this.totalRefills++;
            this.waterCount = parseInt(this.waterCount) + parseInt(this.bottleSize);
            this.plasticBottlesSaved = parseFloat(this.waterCount / 16);

            this.saveToLocalStorage();
            user.render();

            //update them in the database
            const response = await fetch('/userUpdate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: this.username,
                    password: this.password,
                    totalRefills: this.totalRefills,
                    bottleSize: this.bottleSize,
                    waterCount: this.waterCount,
                    bottleSaved: this.plasticBottlesSaved
                }),
            });
            if(!response.ok){
                throw new Error(`Error! Status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    //delete user function
    async deleteUser() {
        try {
            const response = await fetch('/deleteUser', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
            });
            if(!response.ok) {
                throw new Error(`Error! Status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }
        
    }

    checkSignInStatus() {
        // If user information is present in local storage, load it
        this.loadFromLocalStorage();

        // If user information is loaded, render the side panel
        if (this.username) {
            this.render();
        }
    }

    sidePanelUpdate() {
        const sidePanel = document.querySelector('.side-panel');
        sidePanel.innerHTML = `
                <div class="login-container">
                    <div class="login-header">
                      Login or Sign Up
                    </div>
                    <div class="login-form">
                      <input type="text" id="username" name="username" placeholder="Enter your username">
                
                      <input type="password" id="password" name="password" placeholder="Enter your password">
                
                      <button type="submit" id="login">Log In</button>
                      <p>Don't have an account? <a href="#" id="sign-up">Sign Up</a></p>
                    </div>
                </div>
            `;          

            //re-add login button event listener
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const loginButton = document.getElementById('login')
            loginButton.addEventListener('click', async () => {
                    let username = usernameInput.value;
                    let password = passwordInput.value;
                    await user.login(username, password); 
            });

            //add event listener to usernameInput to fix error message
            if(usernameInput) {
                usernameInput.addEventListener('input', () => {
                    usernameInput.style.color = 'black';
                    usernameInput.style.fontWeight = 'normal';
                })
                usernameInput.addEventListener('click', () => {
                    usernameInput.value = '';
                    usernameInput.style.fontWeight = 'normal';
                })
            }  

            //re-add event listener for sign up button if it exists
            const signUpButton = document.querySelector('.login-form a');
            if(signUpButton) {
                signUpButton.addEventListener('click', () => {
                    document.querySelector('.login-header').textContent = 'Sign Up';
                    document.querySelector('.login-form p').textContent = '';
                    usernameInput.value = '';
                    passwordInput.value = '';
                    
                    //create a new button to replace login button
                    let signupButton2 = document.createElement('button');
                    signupButton2.textContent = 'Sign Up';
                    signupButton2.id = 'signup';
                
                    //replace login button with sign up button
                    loginButton.parentNode.replaceChild(signupButton2, loginButton);
                
                    //add event listener for new button
                    signupButton2.addEventListener('click', async () => {
                        let username = usernameInput.value;
                        let password = passwordInput.value;
                        await user.signUp(username, password); 
                    });
                    //add event listener to usernameInput to fix error message
                    usernameInput.addEventListener('input', () => {
                        usernameInput.style.color = 'black';
                    })
                    usernameInput.addEventListener('click', () => {
                        usernameInput.value = '';
                    })
                });
            }
    }

    render() {
        // Assuming you have an element with the id 'side-panel' for your side panel
        const sidePanel = document.querySelector('.side-panel');

        // Update the HTML content with user information
        sidePanel.innerHTML = `
            <center>
                <div id="user-display">
                    <div id="user-display-ribbon">
                        <img src="images/icons8-user-48.png" id="user-icon" alt="user icon" width=100px>
                        <h1>${this.username}</h1>
                    </div>
                    <div id="user-display-content">
                        <h3>Total Refills: ${this.totalRefills}</h3>
                        <h3>Plastic Bottles Saved: ${this.plasticBottlesSaved}</h3>
                        <h3>Water Count (oz): ${this.waterCount}</h3>
                        <label for="bottle-size" id="bottle-size-label">Bottle Size (oz):</label> <br>
                        <input type="number" id="bottle-size" placeholder=${this.bottleSize}></>
                        <br>
                        <button class="refill" type="button">Refill</button>
                        <button class="logout" type="button">Logout</button>
                    </div>
                    <button class="delete" type="delete">Delete Account</button>
                </div>
        `;

        //add event listener for updating bottleSize
        const userBottleSize = document.getElementById('bottle-size').addEventListener('input', (e) => {
            this.bottleSize = (e.target.value);
        })

        //add event listener for refill button
        const refillButton = document.querySelector('.refill').addEventListener('click', () => {
            this.refill();
        });

        //add event listener for logout button
        const logoutButton = document.querySelector('.logout').addEventListener('click', () => {
            this.clearLocalStorage();
            this.sidePanelUpdate();
        });

        //add event listener for delete accoutn button
        const deleteButton = document.querySelector('.delete').addEventListener('click', () => {
            this.deleteUser();
            this.clearLocalStorage();
            this.sidePanelUpdate();
        })
    }
}

export const user = new User();

user.checkSignInStatus();