import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk(
    'fetchProducts',
    async () => {
        return await axios.get('/api/v1/products/')
    }
)

// pending , fulfilled , rejected