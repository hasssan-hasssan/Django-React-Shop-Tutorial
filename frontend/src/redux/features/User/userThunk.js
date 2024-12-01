import { createAsyncThunk } from "@reduxjs/toolkit";
import UserServices from "../../../services/userServices";
import { updateNameAndEmail } from "./userSlice";

export const login = createAsyncThunk(
    'login',
    async (user, thunkAPI) => {
        try {
            return await UserServices.signInUser(user.email, user.password)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
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
    async (user, thunkAPI) => {
        try {
            return await UserServices.signUpUser(user.name, user.email, user.password)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const getUserDetails = createAsyncThunk(
    'getUserDetails',
    async (id, thunkAPI) => {
        try {
            const { userLogin: { userInfo } } = thunkAPI.getState()
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
            const response = await UserServices.getUserProfile(id, config)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const updateUserProfile = createAsyncThunk(
    'updateUserProfile',
    async (user, thunkAPI) => {
        try {
            const { userLogin: { userInfo } } = thunkAPI.getState()
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
            const response = await UserServices.updateUserProfile(user, config)
            thunkAPI.dispatch(updateNameAndEmail({ 'name': response.data.name, 'email': response.data.email }))
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)