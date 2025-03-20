import { createSlice } from '@reduxjs/toolkit'
import { createOrder, getOrderDetails, getMyOrderList } from './orderThunk'
import { logout } from '../User/userThunk'


// Slice 1: Manages the creation of an order
export const orderCreateSlice = createSlice({
    name: 'orderCreate', // The slice name
    initialState: {
        loading: false, // Tracks whether the order creation process is in progress
        success: false, // Indicates if the order creation was successful
        order: {}, // Stores the created order details
        error: '' // Stores any error message from the order creation process
    },
    reducers: {
        // Resets the order creation state to its initial values
        reset: (state) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        // Handles the 'pending' state of the createOrder action
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true
            state.success = false
            state.order = {}
            state.error = ''
        })
        // Handles the 'fulfilled' state of the createOrder action
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.order = action.payload.data // The newly created order data
        })
        // Handles the 'rejected' state of the createOrder action
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.order = {}
            // Sets an error message from the response payload or a default message
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
        // Clears the state on user logout
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = ''
        })
    }
})

// Exporting the reset action from orderCreateSlice
export const { reset } = orderCreateSlice.actions

// Slice 2: Manages the fetching of order details
export const orderDetailsSlice = createSlice({
    name: 'orderDetails', // The slice name
    initialState: {
        loading: false, // Tracks whether the fetching process is in progress
        order: {}, // Stores the fetched order details
        error: '' // Stores any error message from the fetching process
    },
    extraReducers: (builder) => {
        // Handles the 'pending' state of the getOrderDetails action
        builder.addCase(getOrderDetails.pending, (state) => {
            state.loading = true
            state.order = {}
            state.error = ''
        })
        // Handles the 'fulfilled' state of the getOrderDetails action
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.data // The fetched order details
            state.error = ''
        })
        // Handles the 'rejected' state of the getOrderDetails action
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false
            state.order = {}
            // Sets an error message from the response payload or a default message
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
        // Clears the state on user logout
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.order = {}
            state.error = ''
        })
    }
})

// Slice 3: Manages the list of a user's orders
export const orderListMySlice = createSlice({
    name: 'orderListMy', // The slice name
    initialState: {
        loading: false, // Tracks whether the fetching process is in progress
        orders: [], // Stores the list of orders
        error: '' // Stores any error message from the fetching process
    },
    extraReducers: (builder) => {
        // Handles the 'pending' state of the getMyOrderList action
        builder.addCase(getMyOrderList.pending, (state) => {
            state.loading = true
            state.orders = []
            state.error = ''
        })
        // Handles the 'fulfilled' state of the getMyOrderList action
        builder.addCase(getMyOrderList.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.data // The fetched list of orders
            state.error = ''
        })
        // Handles the 'rejected' state of the getMyOrderList action
        builder.addCase(getMyOrderList.rejected, (state, action) => {
            state.loading = false
            state.orders = []
            // Sets an error message from the response payload or a default message
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail
                : action.payload.message
        })
        // Clears the state on user logout
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.orders = []
            state.error = ''
        })
    }
})
