import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decreaseQty, increaseQty, removeItem } from '../redux/features/Cart/cartSlice'
import { Row, Col, ListGroup, Image, ButtonGroup, Button, Form, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'

// The CartScreen component manages the user's shopping cart.
// It allows users to view items in their cart, update quantities, remove items, and proceed to checkout.

function CartScreen() {
    const dispatch = useDispatch() // Accesses the Redux dispatch function
    const navigate = useNavigate() // Provides navigation functionality
    const { cartItems } = useSelector(state => state.cart) // Retrieves the cart items from Redux state

    // Handles the action of proceeding to the checkout page
    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping') // Redirects the user to the login page, then to the shipping page if logged in
    }

    return (
        <Row>
            {/* Shopping Cart Heading */}
            <h1 className='py-4'>shopping cart</h1>

            {/* Main Content Area for Cart Items */}
            <Col md={8}>
                {cartItems.length === 0 ? (
                    // Show a message if the cart is empty
                    <Message variant='info' text='Your cart is empty!' />
                ) : (
                    // Display the list of cart items if there are any
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product} className='py-4'>
                                <Row className='text-center'>
                                    {/* Product Image */}
                                    <Col md={3} className='my-auto'>
                                        <Image src={item.image} alt={item.name} fluid />
                                    </Col>

                                    {/* Product Name (links to product details page) */}
                                    <Col md={3} className='my-auto'>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>

                                    {/* Product Price */}
                                    <Col md={2} className='my-auto'>${item.price}</Col>

                                    {/* Quantity Selector */}
                                    <Col md={3} className='my-auto'>
                                        <ButtonGroup size='sm'>
                                            {/* Decrease Quantity Button */}
                                            <Button
                                                onClick={() => dispatch(decreaseQty(item.product))}
                                                disabled={item.qty === 1} // Disable if quantity is at the minimum
                                                size='sm'
                                            >
                                                <i className="fa-solid fa-minus"></i>
                                            </Button>
                                            {/* Current Quantity (read-only) */}
                                            <Form.Control
                                                className='text-center'
                                                value={item.qty}
                                                size='sm'
                                                readOnly
                                            />
                                            {/* Increase Quantity Button */}
                                            <Button
                                                onClick={() => dispatch(increaseQty(item.product))}
                                                disabled={item.qty === item.countInStock} // Disable if quantity reaches stock limit
                                                size='sm'
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>

                                    {/* Remove Item Button */}
                                    <Col md={1} className='my-auto'>
                                        <Button
                                            onClick={() => dispatch(removeItem(item.product))}
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

            {/* Summary Section */}
            <Col md={4}>
                <Card className='sticky-top'>
                    <ListGroup>
                        {/* Subtotal */}
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        {/* Proceed to Checkout Button */}
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block w-100'
                                disabled={cartItems.length === 0} // Disable if cart is empty
                                onClick={checkoutHandler}
                            >
                                proceed to checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
