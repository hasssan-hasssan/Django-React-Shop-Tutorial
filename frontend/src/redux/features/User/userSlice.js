import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register, getUserDetails, updateUserProfile } from "./userThunk";


export const userLoginSlice = createSlice({
    name: 'userLogin', // Slice name for login state
    initialState: {
        userInfo: {}, // Stores user info (e.g., name, email, tokens)
        loading: false, // Indicates if the login process is in progress
        error: '' // Stores any login-related error messages
    },
    reducers: {
        // Updates user's name and email
        updateNameAndEmail: (state, action) => {
            state.userInfo.name = action.payload.name
            state.userInfo.email = action.payload.email
            // Persist updated user info to localStorage
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        },
        // Updates access and refresh tokens
        updateTokens: (state, action) => {
            state.userInfo.access = action.payload.access
            state.userInfo.refresh = action.payload.refresh
            // Persist updated user info to localStorage
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        }
    },
    extraReducers: (builder) => {
        // Handles login initiation
        builder.addCase(login.pending, (state) => {
            state.userInfo = {}
            state.loading = true
            state.error = ''
        })
        // Handles login success
        builder.addCase(login.fulfilled, (state, action) => {
            state.userInfo = action.payload.data // Store user info
            state.loading = false
            state.error = ''
        })
        // Handles login failure
        builder.addCase(login.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
        // Clears user info on logout
        builder.addCase(logout.fulfilled, (state) => {
            state.userInfo = {}
            state.loading = false
            state.error = ''
        })
    }
})
// Export reducer actions
export const { updateNameAndEmail, updateTokens } = userLoginSlice.actions


export const userRegisterSlice = createSlice({
    name: 'userRegister', // Slice name for registration state
    initialState: {
        userInfo: {}, // Stores user registration info
        loading: false, // Indicates if the registration process is in progress
        success: false, // Indicates successful registration
        error: '' // Stores any registration-related error messages
    },
    extraReducers: (builder) => {
        // Handles registration initiation
        builder.addCase(register.pending, (state) => {
            state.userInfo = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        // Handles registration success
        builder.addCase(register.fulfilled, (state, action) => {
            state.userInfo = action.payload.data // Store registered user info
            state.loading = false
            state.success = true
            state.error = ''
        })
        // Handles registration failure
        builder.addCase(register.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.details
                ? action.payload.response.data.details
                : action.payload.message
        })
        // Clears registration state on logout
        builder.addCase(logout.fulfilled, (state) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = ''
        })
    }
})


export const userDetailsSlice = createSlice({
    name: 'userDetails', // Slice name for user details state
    initialState: {
        user: {}, // Stores detailed user profile information
        loading: false, // Indicates if the fetch process is in progress
        success: false, // Indicates successful profile retrieval
        error: '' // Stores any profile-related error messages
    },
    extraReducers: (builder) => {
        // Handles fetching user details initiation
        builder.addCase(getUserDetails.pending, (state) => {
            state.user = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        // Handles successful fetching of user details
        builder.addCase(getUserDetails.fulfilled, (state, action) => {
            state.user = action.payload.data // Store fetched user details
            state.loading = false
            state.success = true
            state.error = ''
        })
        // Handles fetching user details failure
        builder.addCase(getUserDetails.rejected, (state, action) => {
            state.user = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
        // Clears user details on logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = {}
            state.loading = false
            state.success = false
            state.error = ''
        })
    }
})


export const userUpdateProfileSlice = createSlice({
    name: 'userUpdateProfile', // Slice name for profile update state
    initialState: {
        userInfo: {}, // Stores updated user information
        loading: false, // Indicates if the update process is in progress
        success: false, // Indicates successful profile update
        error: '' // Stores any update-related error messages
    },
    reducers: {
        // Resets profile update state to its initial values
        reset: (state) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        // Handles profile update initiation
        builder.addCase(updateUserProfile.pending, (state) => {
            state.userInfo = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        // Handles successful profile update
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.userInfo = action.payload.data // Store updated profile info
            state.loading = false
            state.success = true
            state.error = ''
        })
        // Handles profile update failure
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
    }
})
// Export reset reducer action
export const { reset } = userUpdateProfileSlice.actions
