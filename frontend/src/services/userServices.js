import { backend, authAxiosInstance } from "../utils/axiosInstance";


// The UserServices module provides API methods for user-related operations,
// such as authentication, user profile management, and token refresh.

const signInUser = (email, password) => {
    // Sends a POST request to the login endpoint with user credentials
    // Endpoint: '/api/v1/users/login/'
    return backend.post('/api/v1/users/login/', { 'username': email, 'password': password }).then((response) => {
        // If the response indicates a successful login (status code 2xx)
        if (String(response.status).startsWith('2')) {
            // Store user information (from response data) in localStorage
            localStorage.setItem('userInfo', JSON.stringify(response.data))
        }
        return response // Return the response for further handling
    })
}

const signOutUser = () => {
    // Removes user information from localStorage to log the user out
    localStorage.removeItem('userInfo')
}

const signUpUser = (name, email, password) => {
    // Sends a POST request to the register endpoint with user details
    // Endpoint: '/api/v1/users/register/'
    return backend.post('/api/v1/users/register/', { 'name': name, 'email': email, 'password': password })
}

const getUserProfile = (id, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a GET request to fetch the profile of a specific user by ID
    // Endpoint: `/api/v1/users/:id/`
    return authBackend.get(`/api/v1/users/${id}/`)
}

const updateUserProfile = (data, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a PUT request to update the user's profile with the provided data
    // Endpoint: '/api/v1/users/profile/update/'
    return authBackend.put('/api/v1/users/profile/update/', data)
}

const tokenRefresh = (data) => {
    // Sends a POST request to refresh an expired or invalid token
    // Endpoint: '/api/v1/users/token/refresh/'
    return backend.post('/api/v1/users/token/refresh/', data)
}

// Exports all methods as part of the UserServices object for easy access
const UserServices = {
    signInUser,        // Authenticate the user and log them in
    signOutUser,       // Log the user out and clear stored data
    signUpUser,        // Register a new user
    getUserProfile,    // Fetch a user's profile by ID
    updateUserProfile, // Update a user's profile
    tokenRefresh       // Refresh the authentication token
}

export default UserServices // Export the UserServices object for use throughout the app
