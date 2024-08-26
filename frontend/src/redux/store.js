import { configureStore } from '@reduxjs/toolkit'
import { listProduct, productDetails } from './features/Product/productSlice'

const rootReducer = {
    listProduct: listProduct.reducer,
    productDetails: productDetails.reducer
}
const initialState = {}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;