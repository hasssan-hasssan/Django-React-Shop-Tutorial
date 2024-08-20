import { configureStore } from '@reduxjs/toolkit'


const rootReducer = {}
const initialState = {}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
})

export default store;