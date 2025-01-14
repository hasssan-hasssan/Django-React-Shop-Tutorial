import { authAxiosInstance } from '../utils/axiosInstance'

const addOrderItems = (order, { userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.post('/api/v1/orders/add/', order)
}


const getOrderById = (orderId, { userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.get(`/api/v1/orders/${orderId}/`)
}


const getMyOrders = ({ userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.get('/api/v1/orders/my/')
}


const OrderServices = { addOrderItems, getOrderById, getMyOrders }
export default OrderServices