import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register, getUserDetails, updateUserProfile } from "./userThunk";


export const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        userInfo: {},
        loading: false,
        error: ''
    },
    reducers: {
        updateNameAndEmail: (state, action) => {
            state.userInfo.name = action.payload.name
            state.userInfo.email = action.payload.email
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        },
        updateTokens: (state, action) => {
            state.userInfo.access = action.payload.access
            state.userInfo.refresh = action.payload.refresh
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.userInfo = {}
            state.loading = true
            state.error = ''
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.userInfo = action.payload.data
            state.loading = false
            state.error = ''
        })
        builder.addCase(login.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })

        builder.addCase(logout.fulfilled, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.error = ''
        })
    }
})
export const { updateNameAndEmail, updateTokens } = userLoginSlice.actions;


export const userRegisterSlice = createSlice({
    name: 'userRegister',
    initialState: {
        userInfo: {},
        loading: false,
        success: false,
        error: ''
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.userInfo = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.userInfo = action.payload.data
            state.loading = false
            state.success = true
            state.error = ''
        })
        builder.addCase(register.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.details
                ? action.payload.response.data.details : action.payload.message
            // console.log('Register rejected: ', action)
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = ''
        })
    }

})


export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
        user: {},
        loading: false,
        success: false,
        error: ''
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDetails.pending, (state) => {
            state.user = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        builder.addCase(getUserDetails.fulfilled, (state, action) => {
            state.user = action.payload.data
            state.loading = false
            state.success = true
            state.error = ''
        })
        builder.addCase(getUserDetails.rejected, (state, action) => {
            state.user = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = {}
            state.loading = false
            state.success = false
            state.error = ''
        })
    }
})


export const userUpdateProfileSlice = createSlice({
    name: 'userUpdateProfile',
    initialState: {
        userInfo: {},
        loading: false,
        success: false,
        error: ''
    },
    reducers: {
        reset: (state) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserProfile.pending, (state) => {
            state.userInfo = {}
            state.loading = true
            state.success = false
            state.error = ''
        })
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.userInfo = action.payload.data
            state.loading = false
            state.success = true
            state.error = ''
        })
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.success = false
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })
    }
})
export const { reset } = userUpdateProfileSlice.actions;