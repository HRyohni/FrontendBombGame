import store from '../store';
import router from "@/router";
import axios from "axios"; // Adjust the path according to your project structure

// Access the getter to get user data


// user.js

const USER_DATA_KEY = 'userData';







function _isNullOrUndefined(value) {
    return value === null || value === undefined || value === {};
}

async function _removePasswordFromUserData(userData) {
    const userDataClone = {...userData};

    if (userDataClone && userDataClone.password) {
        delete userDataClone.password;
    }
    return userDataClone;
}


async function _fetchUserFromDB() {
    try {
        const response = await axios.get("/api/fetchUser"); // Replace "/api/getUserData" with your actual API endpoint
        const userData = response.data;

        if (userData) {
            return _removePasswordFromUserData(userData);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to get user data:', error);
        throw error; // Propagate the error to the caller for further handling
    }
}

async function  _checkUserAuth() {
    let userData = await store.getters.getUser;
    console.log(userData, "data from userClass");
    if (_isNullOrUndefined(userData)) {
        console.log("User isnt loged in");
        return false;
    } else {
        console.log("DataFromUserClass:User is logged in:", userData);
        return true;
    }
}

async function getUserData() {
    const userDataString = localStorage.getItem(USER_DATA_KEY);
    return userDataString ? JSON.parse(userDataString) : null;
}



async function changeUrlOnLogin()
{
    if (!await _checkUserAuth()) {
        await router.push("/login-register")
    }
}
async function logOutUser() {
    await store.dispatch('updateUser', null);
}

async function updateUserData(newUserData) {
    try {
        // Update Vuex store
        await store.dispatch('updateUser', newUserData);

        // Store user data in local storage
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData));
    } catch (error) {
        console.error('Failed to update user data:', error);
    }
}


export const user = {
    changeUrlOnLogin,
    getUserData,
    logOutUser,
    updateUserData,

};