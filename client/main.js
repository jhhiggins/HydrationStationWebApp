import { user } from './user.js';


let buildings = [];
const buildingsGrid = document.getElementById('grid-container');
const searchbox = document.getElementById('search');
const sidePanelButton = document.querySelector('.side-panel-button');
const signUpButton = document.querySelector('.login-form a');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

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

//add event listener for login button if it exists
if(loginButton) {
    loginButton.addEventListener('click', async () => {
        let username = usernameInput.value;
        let password = passwordInput.value;
        await user.login(username, password); 
    });
}

//add event listener for sign up button if it exists
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
    });
}

//add event listener for side panel button to toggle side panel
sidePanelButton.addEventListener('click', () => {
    document.querySelector('.wrapper').classList.toggle('side-panel-open');
});

// add event listener for search that listens for input
searchbox.addEventListener('input', e => {
    const value = e.target.value.toLowerCase(); //grabs the users input and converts it to lowercase

    // loop through buildings and set visible if contains input
    buildings.forEach(building => {
        const isVisible = building.name.toLowerCase().includes(value);
        building.element.classList.toggle('hide', !isVisible);
    });
});

async function fetchBuildingData() {
    try {
        const data = await fetch('BuildingData.json')
        buildings = await data.json();
        // console.log(buildings);
        generateBuildings();
    } catch (error) {
        console.error('Error loading building data: ' + error);
    }
}

function generateBuildings() {
    // clear the page of all building data
    while (buildingsGrid.firstChild) {
        buildingsGrid.remove(buildingsGrid.firstChild);
    }

    // populate the grid with buildings
    buildings = buildings.map(curr => {
        const elem = document.createElement('div');
        elem.classList.add('grid-item');
        // console.log(curr.name);
        elem.textContent = curr.building;

        // set default side
        let flipped = false

        // add event listener for each elem
        elem.addEventListener('click', () => {
            if (flipped === false) {
                elem.classList.toggle('clicked');
                elem.classList.add('clicked')
                let stationsArr = curr.floor
                // console.log(stationsArr.length)
                let floorsListed = curr.floor.join(', ');
                elem.textContent = floorsListed;
                flipped = true;
            } else {
                elem.classList.toggle('clicked');
                elem.classList.remove('clicked')
                elem.textContent = curr.building;
                flipped = false;
            }
        });

        //add to the grid
        buildingsGrid.appendChild(elem);
        return {name: curr.building, count: curr.floor.length, element: elem}
    });
}

fetchBuildingData();