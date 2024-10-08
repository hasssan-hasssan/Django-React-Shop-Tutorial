import { createSlice } from '@reduxjs/toolkit'


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: []
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
        }
    }
})


export const { addItem, increaseQty, decreaseQty, removeItem } = cartSlice.actions
