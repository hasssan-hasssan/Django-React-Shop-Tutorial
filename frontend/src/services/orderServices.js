import { authAxiosInstance } from '../utils/axiosInstance'

const addOrderItems = (order, { userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.post('/api/v1/orders/add/', order)
}

const OrderServices = { addOrderItems }
export default OrderServices