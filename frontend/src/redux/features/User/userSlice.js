import { createSlice } from "@reduxjs/toolkit";
import { login } from "./userThunk";


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
    }
})