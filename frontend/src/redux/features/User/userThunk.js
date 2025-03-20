import { createAsyncThunk } from "@reduxjs/toolkit";
import UserServices from "../../../services/userServices";
import { updateNameAndEmail } from "./userSlice";


export const login = createAsyncThunk(
    'login', // Action type
    async (user, thunkAPI) => {
        try {
            // Calls the UserServices API to sign in the user with email and password
            return await UserServices.signInUser(user.email, user.password)
        } catch (error) {
            // Returns the error to be handled in the rejected case
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const logout = createAsyncThunk(
    'logout', // Action type
    () => {
        // Calls the UserServices API to sign out the user
        UserServices.signOutUser()
    }
)


export const register = createAsyncThunk(
    'register', // Action type
    async (user, thunkAPI) => {
        try {
            // Calls the UserServices API to sign up the user with name, email, and password
            return await UserServices.signUpUser(user.name, user.email, user.password)
        } catch (error) {
            // Returns the error to be handled in the rejected case
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const getUserDetails = createAsyncThunk(
    'getUserDetails', // Action type
    async (id, { dispatch, getState, rejectWithValue }) => {
        try {
            // Extracts the authenticated user's info from the Redux state
            const { userLogin: { userInfo } } = getState()

            // Calls the UserServices API to get the user's profile by ID
            return await UserServices.getUserProfile(id, { userInfo, dispatch })
        } catch (error) {
            // Returns the error to be handled in the rejected case
            return rejectWithValue(error)
        }
    }
)


export const updateUserProfile = createAsyncThunk(
    'updateUserProfile', // Action type
    async (user, { dispatch, getState, rejectWithValue }) => {
        try {
            // Extracts the authenticated user's info from the Redux state
            const { userLogin: { userInfo } } = getState()

            // Calls the UserServices API to update the user's profile
            const response = await UserServices.updateUserProfile(user, { userInfo, dispatch })

            // Dispatches an action to update the name and email in the local Redux state
            dispatch(updateNameAndEmail({ 'name': response.data.name, 'email': response.data.email }))

            // Returns the API response for use in the fulfilled case
            return response
        } catch (error) {
            // Returns the error to be handled in the rejected case
            return rejectWithValue(error)
        }
    }
)
