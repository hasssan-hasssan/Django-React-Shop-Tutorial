import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register } from "./userThunk";


export const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        userInfo: {},
        loading: false,
        error: ''
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
            state.error = action.error.message
        })

        builder.addCase(logout.fulfilled, (state, action) => {
            state.userInfo = {}
            state.loading = false
            state.error = ''
        })
    }
})


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
    }

})