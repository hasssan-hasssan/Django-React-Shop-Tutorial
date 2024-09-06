import { configureStore } from '@reduxjs/toolkit'
import { listProduct, productDetails } from './features/Product/productSlice'
import { cartSlice } from './features/Cart/cartSlice'

const rootReducer = {
    listProduct: listProduct.reducer,
    productDetails: productDetails.reducer,
    cart: cartSlice.reducer,
}
const initialState = {}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;