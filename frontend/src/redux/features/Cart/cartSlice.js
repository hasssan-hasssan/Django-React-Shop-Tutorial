import { createSlice } from '@reduxjs/toolkit'


// The cartSlice manages the state of the shopping cart in the Redux store.
// It includes the cart items, shipping address, and payment method.

export const cartSlice = createSlice({
    name: 'cart', // The name of the slice
    initialState: {
        cartItems: [], // Initial state for the list of items in the cart
        shippingAddress: {}, // Initial state for the user's shipping address
        paymentMethod: '', // Initial state for the selected payment method
    },
    reducers: {
        // Adds an item to the cart or updates it if it already exists.
        addItem: (state, action) => {
            const item = action.payload // The item being added to the cart
            const existItem = state.cartItems.find(x => x.product === item.product) // Check if the item already exists in the cart
            if (existItem) {
                // If the item exists, update its details
                state.cartItems = state.cartItems.map(x => x.product === item.product ? item : x)
            } else {
                // If the item does not exist, add it to the cart
                state.cartItems = [...state.cartItems, item]
            }
            // Save the updated cart items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Increases the quantity of a specific item in the cart
        increaseQty: (state, action) => {
            const item = state.cartItems.find(x => x.product === action.payload) // Find the item in the cart
            item.qty++ // Increment the quantity of the item
            // Save the updated cart items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Decreases the quantity of a specific item in the cart
        decreaseQty: (state, action) => {
            const item = state.cartItems.find(x => x.product === action.payload) // Find the item in the cart
            item.qty-- // Decrement the quantity of the item
            // Save the updated cart items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Removes a specific item from the cart
        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(x => x.product !== action.payload) // Filter out the item to be removed
            // Save the updated cart items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        // Clears all items from the cart
        clearItems: (state) => {
            state.cartItems = [] // Reset the cart items array
            localStorage.removeItem('cartItems') // Remove cart items from localStorage
        },

        // Saves the shipping address to the state and localStorage
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload // Update the shipping address
            // Save the updated shipping address to localStorage
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },

        // Saves the payment method to the state and localStorage
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload // Update the payment method
            // Save the updated payment method to localStorage
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        }
    }
})

// Exporting the reducer actions for use in dispatch calls
export const {
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearItems,
    saveShippingAddress,
    savePaymentMethod
} = cartSlice.actions

