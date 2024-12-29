import { configureStore } from '@reduxjs/toolkit'
import { listProductSlice, productDetailsSlice } from './features/Product/productSlice'
import { cartSlice } from './features/Cart/cartSlice'
import { userLoginSlice, userRegisterSlice, userDetailsSlice, userUpdateProfileSlice } from './features/User/userSlice'
import { orderCreateSlice, orderDetailsSlice } from './features/Order/orderSlice'

// fetch user cart 
const cartItemsFromLocalStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

// fetch user information
const userInfoFromLocalStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : {}


const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const paymentMethodFromLocalStorage = localStorage.getItem('paymentMethod') ?
    JSON.parse(localStorage.getItem('paymentMethod')) : ''

const initialState = {
    // Initializaion the redux store
    cart: {
        cartItems: cartItemsFromLocalStorage,
        shippingAddress: shippingAddressFromLocalStorage,
        paymentMethod: paymentMethodFromLocalStorage,
    },
    userLogin: { userInfo: userInfoFromLocalStorage }
}

const rootReducer = {
    listProduct: listProductSlice.reducer,
    productDetails: productDetailsSlice.reducer,
    cart: cartSlice.reducer,
    userLogin: userLoginSlice.reducer,
    userRegister: userRegisterSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    userUpdateProfile: userUpdateProfileSlice.reducer,
    orderCreate: orderCreateSlice.reducer,
    orderDetails: orderDetailsSlice.reducer,
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;