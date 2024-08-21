import { configureStore } from '@reduxjs/toolkit'
import { listProduct } from './features/Product/productSlice'

const rootReducer = {
    listProduct: listProduct.reducer
}
const initialState = {}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;