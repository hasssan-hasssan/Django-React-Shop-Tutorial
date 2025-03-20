import { createAsyncThunk } from '@reduxjs/toolkit'
import ProductService from '../../../services/productServices'

// Thunk 1: Fetches the list of all products
export const fetchProducts = createAsyncThunk(
    'fetchProducts', // The action type
    async (arg, thunkAPI) => {
        try {
            // Calls the ProductService to fetch all products
            return await ProductService.getProducts()
        } catch (error) {
            // If an error occurs, rejects the promise and passes the error for use in the rejected case
            return thunkAPI.rejectWithValue(error)
        }
    }
)

// Thunk 2: Fetches the details of a single product by its ID
export const fetchProductDetails = createAsyncThunk(
    'fetchProductDetails', // The action type
    async (id, thunkAPI) => {
        try {
            // Calls the ProductService to fetch the product details by the given ID
            return await ProductService.getProduct(id)
        } catch (error) {
            // If an error occurs, rejects the promise and passes the error for use in the rejected case
            return thunkAPI.rejectWithValue(error)
        }
    }
)
