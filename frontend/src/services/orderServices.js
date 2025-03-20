import { authAxiosInstance } from '../utils/axiosInstance'


// OrderServices provides various API methods for managing orders,
// including creating orders, fetching order details, fetching user-specific orders, handling payments, and inquiring payment statuses.

const addOrderItems = (order, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a POST request to the '/add/' endpoint with the order data
    return authBackend.post('/api/v1/orders/add/', order)
}

const getOrderById = (orderId, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a GET request to retrieve details of an order by its ID
    return authBackend.get(`/api/v1/orders/${orderId}/`)
}

const getMyOrders = ({ userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a GET request to retrieve the list of orders associated with the logged-in user
    return authBackend.get('/api/v1/orders/my/')
}

const payOrder = (orderId, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a GET request to initiate the payment process for a specific order
    return authBackend.get(`/api/v1/orders/${orderId}/pay/`)
}

const inquiryPay = (token, { userInfo, dispatch }) => {
    // Sets up an authenticated Axios instance with user credentials
    const authBackend = authAxiosInstance(userInfo, dispatch)
    // Sends a GET request to inquire about the payment status using a token
    return authBackend.get(`/api/v1/orders/${token}/inquiry-pay/`)
}

// Exports all the methods as part of the OrderServices object for easy use in other parts of the application
const OrderServices = { addOrderItems, getOrderById, getMyOrders, payOrder, inquiryPay }
export default OrderServices
