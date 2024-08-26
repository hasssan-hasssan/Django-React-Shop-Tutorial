import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk(
    'fetchProducts',
    async () => {
        return await axios.get('/api/v1/products/')
    }
)


export const fetchProductDetails = createAsyncThunk(
    'fetchProductDetails',
    async (id) => {
        return await axios.get(`/api/v1/products/${id}/`)
    }
)