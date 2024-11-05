import { createAsyncThunk } from "@reduxjs/toolkit";
import UserServices from "../../../services/userServices";

export const login = createAsyncThunk(
    'login',
    async (obj) => {
        return await UserServices.signInUser(obj.email, obj.password)
    }
)


export const logout = createAsyncThunk(
    'logout',
    () => {
        UserServices.signOutUser()
    }
)


export const register = createAsyncThunk(
    'register',
    async (obj, thunkAPI) => {
        try {
            const response = await UserServices.signUpUser(obj.name, obj.email, obj.password)
            thunkAPI.dispatch({ type: 'login/fulfilled', payload: response })
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const getUserDetails = createAsyncThunk(
    'getUserDetails',
    async (id, thunkAPI) => {
        const { userLogin: { userInfo } } = thunkAPI.getState()
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const response = await UserServices.getUserProfile(id, config)
        return response
    }
)