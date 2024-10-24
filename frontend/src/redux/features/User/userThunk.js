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