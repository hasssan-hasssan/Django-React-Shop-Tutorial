import { createSlice } from '@reduxjs/toolkit'


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: '',
    },
    reducers: {
        addItem: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)
            if (existItem) {
                // Update
                state.cartItems = state.cartItems.map(x => x.product === item.product ? item : x)
            } else {
                // Insert
                state.cartItems = [...state.cartItems, item]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        increaseQty: (state, action) => {
            const item = state.cartItems.find(x => x.product === action.payload)
            item.qty++
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        decreaseQty: (state, action) => {
            const item = state.cartItems.find(x => x.product === action.payload)
            item.qty--
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(x => x.product !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        }
    }
})


export const { addItem, increaseQty, decreaseQty, removeItem, saveShippingAddress, savePaymentMethod } = cartSlice.actions
