import { createSlice } from '@reduxjs/toolkit'


export const listProduct = createSlice({
    name: 'listProduct',
    initialState: {
        loading: false,
        products: [],
        error: ""
    }
})