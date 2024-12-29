import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderDetails } from '../redux/features/Order/orderThunk'

function OrderScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { orderId } = useParams()
    const { userInfo } = useSelector(state => state.userLogin)
    const { loading, order, error } = useSelector(state => state.orderDetails)

    React.useEffect(() => {
        if (!userInfo.access) {
            navigate(`/login?redirect=/order/${orderId}`)
        } else if (!order._id || (order._id !== orderId)) {
            dispatch(getOrderDetails(orderId))
        }
    }, [userInfo, dispatch, orderId])

    return (
        <div>OrderScreen</div>
    )
}

export default OrderScreen