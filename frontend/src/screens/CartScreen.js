import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decreaseQty, increaseQty } from '../redux/features/Cart/cartSlice'
import { Row, Col, ListGroup, Image, ButtonGroup, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Message'

function CartScreen() {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)
    return (
        <Row>
            <Col md={9}>
                <h1 className='py-4'>shopping cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info' text='Your cart is empty!' />
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product} className='py-4'>
                                <Row className='text-center'>
                                    <Col md={3} className='my-auto'>
                                        <Image src={item.image} alt={item.name} fluid />
                                    </Col>
                                    <Col md={3} className='my-auto'>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2} className='my-auto'>${item.price}</Col>
                                    <Col md={3} className='my-auto'>
                                        <ButtonGroup size='sm'>
                                            <Button
                                                onClick={() => dispatch(decreaseQty(item.product))}
                                                disabled={item.qty === 1}
                                                size='sm'
                                            >
                                                <i class="fa-solid fa-minus"></i>
                                            </Button>
                                            <Form.Control
                                                className='text-center'
                                                value={item.qty}
                                                size='sm'
                                                readOnly
                                            />
                                            <Button
                                                onClick={() => dispatch(increaseQty(item.product))}
                                                disabled={item.qty === item.countInStock}
                                                size='sm'
                                            >
                                                <i class="fa-solid fa-plus"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                    <Col md={1} className='my-auto'>
                                        <Button
                                            type='button'
                                            variant='light'
                                        >
                                            <i className='fas fa-trash fs-4'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col></Col>
        </Row>
    )
}

export default CartScreen