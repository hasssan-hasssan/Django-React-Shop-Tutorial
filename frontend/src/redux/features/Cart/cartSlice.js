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
        }
    }
})
