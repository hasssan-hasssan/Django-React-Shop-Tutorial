import { createAsyncThunk } from '@reduxjs/toolkit'
import ProductService from '../../../services/productServices'

export const fetchProducts = createAsyncThunk(
    'fetchProducts',
    async (arg, thunkAPI) => {
        try {
            return await ProductService.getProducts()
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const fetchProductDetails = createAsyncThunk(
    'fetchProductDetails',
    async (id, thunkAPI) => {
        try {
            return await ProductService.getProduct(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)