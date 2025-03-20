import axios from 'axios'
import dayjs from 'dayjs'
import UserServices from '../services/userServices'
import { jwtDecode } from 'jwt-decode'
import { updateTokens } from '../redux/features/User/userSlice'


// Base URL for the backend API
const baseURL = "http://127.0.0.1:8000"

// Create a standard Axios instance for API requests that do not require authentication
export const backend = axios.create({
    baseURL, // Sets the base URL for all API requests
    headers: {
        'Content-Type': 'application/json' // Specifies the content type for requests
    }
})

// Create an authenticated Axios instance for API requests that require user credentials
export const authAxiosInstance = (userInfo, dispatch) => {
    // Initialize a new Axios instance with authentication headers
    const instance = axios.create({
        baseURL, // Base URL for the backend API
        headers: {
            'Content-Type': 'application/json', // Specifies the content type for requests
            Authorization: `Bearer ${userInfo?.access}` // Includes the access token in the Authorization header
        }
    })

    // Add a request interceptor to handle token expiration and refresh logic
    instance.interceptors.request.use(async req => {
        // Decode the access token to check its expiration time
        const accessToken = jwtDecode(userInfo.access) // Decodes the access token using jwtDecode
        const accessIsExpired = dayjs.unix(accessToken.exp).diff(dayjs()) < 60000; // Checks if the token will expire in less than 60 seconds

        // If the access token is still valid, return the original request
        if (!accessIsExpired) return req

        // Decode the refresh token to check its expiration time
        const refreshToken = jwtDecode(userInfo.refresh)
        const refreshIsExpired = dayjs.unix(refreshToken.exp).diff(dayjs()) < 60000; // Checks if the refresh token will expire in less than 60 seconds

        // If the refresh token is still valid, request a new access token
        if (!refreshIsExpired) {
            const response = await UserServices.tokenRefresh({ refresh: userInfo.refresh }) // Calls the token refresh API
            dispatch(updateTokens(response.data)) // Updates the Redux store with the new access token
            req.headers.Authorization = `Bearer ${response.data.access}` // Updates the Authorization header with the new access token
            return req // Return the modified request with the new token
        } else {
            // Reject the request with an error message if both tokens are expired
            return Promise.reject(new Error('Please sign in again!'))
        }
    })

    // Return the configured Axios instance
    return instance
}
