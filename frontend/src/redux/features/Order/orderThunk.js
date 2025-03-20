import { createAsyncThunk } from "@reduxjs/toolkit";
import OrderServices from '../../../services/orderServices'
import { clearItems } from "../Cart/cartSlice";

// Thunk 1: Handles the creation of an order
export const createOrder = createAsyncThunk(
    'createOrder', // The action type
    async (order, { dispatch, getState, rejectWithValue }) => {
        try {
            // Retrieve user information (e.g., authentication token) from the Redux state
            const { userLogin: { userInfo } } = getState()

            // Send the order to the OrderServices API
            const response = await OrderServices.addOrderItems(order, { userInfo, dispatch })

            // Dispatch the clearItems action to reset the cart state after a successful order
            dispatch(clearItems())

            // Return the response for use in the fulfilled state
            return response
        } catch (error) {
            // Return the error object for use in the rejected state
            return rejectWithValue(error)
        }
    }
)

// Thunk 2: Fetches the details of a specific order
export const getOrderDetails = createAsyncThunk(
    'getOrderDetails', // The action type
    async (orderId, { dispatch, getState, rejectWithValue }) => {
        try {
            // Retrieve user information (e.g., authentication token) from the Redux state
            const { userLogin: { userInfo } } = getState()

            // Fetch order details from the OrderServices API by order ID
            return await OrderServices.getOrderById(orderId, { userInfo, dispatch })
        } catch (error) {
            // Return the error object for use in the rejected state
            return rejectWithValue(error)
        }
    }
)

// Thunk 3: Fetches the list of the logged-in user's orders
export const getMyOrderList = createAsyncThunk(
    'getMyOrderList', // The action type
    async (_DO_NOT_PASS_THIS_ARG_, { dispatch, getState, rejectWithValue }) => {
        try {
            // Retrieve user information (e.g., authentication token) from the Redux state
            const { userLogin: { userInfo } } = getState()

            // Fetch the user's order list from the OrderServices API
            return await OrderServices.getMyOrders({ userInfo, dispatch })
        } catch (error) {
            // Return the error object for use in the rejected state
            return rejectWithValue(error)
        }
    }
)
