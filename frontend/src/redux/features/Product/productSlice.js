import { createSlice } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductDetails } from './productThunk'


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


export const productDetails = createSlice({
    name: 'productDetails',
    initialState: {
        loading: false,
        product: {},
        error: ''
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false
            state.product = action.payload.data
            state.error = ""
        })
        builder.addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false
            state.product = {}
            state.error = action.error.message
        })
    }
})