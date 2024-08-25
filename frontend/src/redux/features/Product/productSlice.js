import { createSlice } from '@reduxjs/toolkit'
import { fetchProducts } from './productThunk'

export const listProduct = createSlice({
    name: 'listProduct',
    initialState: {
        loading: false,
        products: [],
        error: ""
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload.data
            state.error = ""
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false
            state.products = []
            state.error = action.error.message
        })
    }
})