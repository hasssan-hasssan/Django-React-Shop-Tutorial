import { createSlice } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductDetails } from './productThunk'


// Slice 1: Handles the product list state
export const listProductSlice = createSlice({
    name: 'listProduct', // The slice name
    initialState: {
        loading: false, // Tracks whether the product list is being fetched
        products: [], // Stores the fetched list of products
        error: "" // Stores any error message from the fetch process
    },
    extraReducers: (builder) => {
        // Handles the 'pending' state of the fetchProducts action
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true // Set loading to true while fetching
        })
        // Handles the 'fulfilled' state of the fetchProducts action
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false // Set loading to false when fetch is complete
            state.products = action.payload.data // Store the fetched products
            state.error = "" // Clear any previous errors
        })
        // Handles the 'rejected' state of the fetchProducts action
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false // Set loading to false since fetch failed
            state.products = [] // Clear the products array
            // Set an error message from the response payload or a default message
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
    }
})

// Slice 2: Handles the product details state
export const productDetailsSlice = createSlice({
    name: 'productDetails', // The slice name
    initialState: {
        loading: false, // Tracks whether the product details are being fetched
        product: {}, // Stores the details of the selected product
        error: '' // Stores any error message from the fetch process
    },
    extraReducers: (builder) => {
        // Handles the 'pending' state of the fetchProductDetails action
        builder.addCase(fetchProductDetails.pending, (state) => {
            state.loading = true // Set loading to true while fetching
        })
        // Handles the 'fulfilled' state of the fetchProductDetails action
        builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false // Set loading to false when fetch is complete
            state.product = action.payload.data // Store the fetched product details
            state.error = "" // Clear any previous errors
        })
        // Handles the 'rejected' state of the fetchProductDetails action
        builder.addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false // Set loading to false since fetch failed
            state.product = {} // Clear the product details
            // Set an error message from the response payload or a default message
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
    }
})
