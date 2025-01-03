import React from 'react'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderDetails } from '../redux/features/Order/orderThunk'
import { beautifulDate } from '../utils/utils'

function OrderScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { orderId } = useParams()
    const { userInfo } = useSelector(state => state.userLogin)
    const { loading, order, error } = useSelector(state => state.orderDetails)

    let itemsPrice;
    if (order && order.orderItems) {
        itemsPrice = order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    }

    React.useEffect(() => {

        if (!userInfo.access) {
            navigate(`/login?redirect=/order/${orderId}`)
        } else if (!order._id || (order._id !== orderId)) {

            dispatch(getOrderDetails(orderId))
        }
    }, [userInfo, dispatch, orderId])


    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger' text={error} />
    ) : (
        <div>
            <h1 className='mt-4'>Order: #{order._id}</h1>
            <hr />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='mb-3'>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user?.name}</p>
                            <p><strong>Email: </strong>{order.user?.email}</p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress?.country} ,
                                {' '}
                                {order.shippingAddress?.city} ,
                                {' '}
                                {order.shippingAddress?.address} /
                                Postal Code: {order.shippingAddress?.postalCode}
                            </p>
                            {
                                order.isDelivered ? (
                                    <Message variant='success' text={beautifulDate(order.deliveredAt)} />
                                ) : (
                                    <Message variant='warning' text={'Not delivered!'} />
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item className='mb-3'>
                            <h2>payment method</h2>

                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {
                                order.isPaid ? (
                                    <Message variant='success' text={beautifulDate(order.paidAt)} />
                                ) : (
                                    <Message variant='warning' text={'Not paid!'} />
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>order items</h2>

                            <ListGroup variant='flush'>
                                {order.orderItems?.map((item, index) => (
                                    <ListGroup.Item key={index} className='my-3 text-center'>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} X {item.price} = {(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup varian='flush'>
                            <ListGroup.Item>
                                <h2>order summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen