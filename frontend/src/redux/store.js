import { configureStore } from '@reduxjs/toolkit'
import { listProduct, productDetails } from './features/Product/productSlice'
import { cartSlice } from './features/Cart/cartSlice'
import { userLoginSlice } from './features/User/userSlice'


const cartItemsFromLocalStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cart: {
        cartItems: cartItemsFromLocalStorage
    }
}

const rootReducer = {
    listProduct: listProduct.reducer,
    productDetails: productDetails.reducer,
    cart: cartSlice.reducer,
    userLogin: userLoginSlice.reducer,
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;