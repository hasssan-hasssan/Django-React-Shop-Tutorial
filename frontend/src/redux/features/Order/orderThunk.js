import { createAsyncThunk } from "@reduxjs/toolkit";
import OrderServices from '../../../services/orderServices'
import { clearItems } from "../Cart/cartSlice";

export const createOrder = createAsyncThunk(
    'createOrder',
    async (order, { dispatch, getState, rejectWithValue }) => {
        try {
            const { userLogin: { userInfo } } = getState()
            const response = await OrderServices.addOrderItems(order, { userInfo, dispatch })
            dispatch(clearItems())
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const getOrderDetails = createAsyncThunk(
    'getOrderDetails',
    async (orderId, { dispatch, getState, rejectWithValue }) => {
        try {
            const { userLogin: { userInfo } } = getState()
            return await OrderServices.getOrderById(orderId, { userInfo, dispatch })
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const getMyOrderList = createAsyncThunk(
    'getMyOrderList',
    async (_DO_NOT_PASS_THIS_ARG_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { userLogin: { userInfo } } = getState()
            return await OrderServices.getMyOrders({ userInfo, dispatch })
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)