import { createAsyncThunk } from '@reduxjs/toolkit'
import ProductService from '../../../services/productServices'

export const fetchProducts = createAsyncThunk(
    'fetchProducts',
    async () => {
        return await ProductService.getProducts()
    }
)


export const fetchProductDetails = createAsyncThunk(
    'fetchProductDetails',
    async (id) => {
        return await ProductService.getProduct(id)
    }
)