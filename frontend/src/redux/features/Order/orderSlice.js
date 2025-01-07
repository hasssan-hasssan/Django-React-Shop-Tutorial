import { createSlice } from '@reduxjs/toolkit'
import { createOrder, getOrderDetails, getMyOrderList } from './orderThunk'
import { logout } from '../User/userThunk'


export const orderCreateSlice = createSlice({
    name: 'orderCreate',
    initialState: {
        loading: false,
        success: false,
        order: {},
        error: ''
    },
    reducers: {
        reset: (state) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true
            state.success = false
            state.order = {}
            state.error = ''
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.order = action.payload.data
        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.success = false
            state.order = {}
            state.error = ''
        })
    }
})

export const { reset } = orderCreateSlice.actions


export const orderDetailsSlice = createSlice({
    name: 'orderDetails',
    initialState: {
        loading: false,
        order: {},
        error: ''
    },
    extraReducers: (builder) => {
        builder.addCase(getOrderDetails.pending, (state) => {
            state.loading = true
            state.order = {}
            state.error = ''
        })
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.data
            state.error = ''
        })
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false
            state.order = {}
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.order = {}
            state.error = ''
        })
    }
})


export const orderListMySlice = createSlice({
    name: 'orderListMy',
    initialState: {
        loading: false,
        orders: [],
        error: ''
    },
    extraReducers: (builder) => {
        builder.addCase(getMyOrderList.pending, (state) => {
            state.loading = true
            state.orders = []
            state.error = ''
        })
        builder.addCase(getMyOrderList.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.data
            state.error = ''
        })
        builder.addCase(getMyOrderList.rejected, (state, action) => {
            state.loading = false
            state.orders = []
            state.error = action.payload.response && action.payload.response.data.detail
                ? action.payload.response.data.detail : action.payload.message
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.orders = []
            state.error = ''
        })
    }
})