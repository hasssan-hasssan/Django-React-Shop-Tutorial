import React from 'react'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { calculatePrices } from '../utils/utils'

function PlaceOrderScreen() {

    const cart = useSelector(state => state.cart)
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices(cart)
    const placeOrder = () => {
        console.log('Place Order!')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='mb-3'>
                            <h2>Shipping</h2>
                            {
                                cart.shippingAddress.address ? (
                                    <p>
                                        <strong>Shipping: </strong>
                                        {cart.shippingAddress.country} ,
                                        {' '}
                                        {cart.shippingAddress.city} ,
                                        {' '}
                                        {cart.shippingAddress.address} /
                                        Postal Code: {cart.shippingAddress.postalCode}
                                    </p>
                                ) : (
                                    <Message variant='warning' text='Shipping address not entered!' />
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item className='mb-3'>
                            <h2>payment method</h2>
                            {
                                cart.paymentMethod ? (
                                    <p>
                                        <strong>Method: </strong>
                                        {cart.paymentMethod}
                                    </p>
                                ) : (
                                    <Message variant='warning' text='Payment method not selected!' />
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>order items</h2>
                            {
                                cart.cartItems.length === 0
                                    ? <Message variant='warning' text='Your cart is empty!' />
                                    : (
                                        <ListGroup variant='flush'>
                                            {cart.cartItems.map((item, index) => (
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
                                    )
                            }
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
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block w-100'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrder}
                                >Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default PlaceOrderScreen