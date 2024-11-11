import { configureStore } from '@reduxjs/toolkit'
import { listProduct, productDetails } from './features/Product/productSlice'
import { cartSlice } from './features/Cart/cartSlice'
import { userLoginSlice, userRegisterSlice, userDetailsSlice, userUpdateProfileSlice } from './features/User/userSlice'

// fetch user cart 
const cartItemsFromLocalStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

// fetch user information
const userInfoFromLocalStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : {}

const initialState = {
    // Initializaion the redux store
    cart: { cartItems: cartItemsFromLocalStorage },
    userLogin: { userInfo: userInfoFromLocalStorage }
}

const rootReducer = {
    listProduct: listProduct.reducer,
    productDetails: productDetails.reducer,
    cart: cartSlice.reducer,
    userLogin: userLoginSlice.reducer,
    userRegister: userRegisterSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    userUpdateProfile: userUpdateProfileSlice.reducer,
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;