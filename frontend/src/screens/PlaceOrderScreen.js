import React from 'react'
import Message from '../components/Message'
import Loader from '../components/Loader'
import CheckoutSteps from '../components/CheckoutSteps'
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createOrder } from '../redux/features/Order/orderThunk'
import { reset } from '../redux/features/Order/orderSlice'
import { calculatePrices } from '../utils/utils'


// The PlaceOrderScreen component handles the final step in the checkout process.
// It displays the shipping details, payment method, order items, and calculates the order summary.
// Users can confirm and place their order.

function PlaceOrderScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch
    const navigate = useNavigate() // Allows programmatic navigation (e.g., redirecting after order creation)

    // Retrieves the cart state from Redux
    const cart = useSelector(state => state.cart)

    // Destructures the calculated prices from a helper function
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices(cart)

    // Dispatches the createOrder action with order details
    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems, // Items in the cart
            shippingAddress: cart.shippingAddress, // Shipping address details
            paymentMethod: cart.paymentMethod, // Selected payment method
            itemsPrice: itemsPrice, // Calculated items price
            shippingPrice: shippingPrice, // Calculated shipping price
            taxPrice: taxPrice, // Calculated tax
            totalPrice: totalPrice, // Total price including all charges
        }))
    }

    // Retrieves the order creation state from Redux
    const { loading, error, success, order } = useSelector(state => state.orderCreate)

    // Redirects the user to the order details page upon successful order creation
    React.useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`) // Redirect to the newly created order's details page
            dispatch(reset()) // Reset the order creation state
        }
    }, [success, navigate, order, dispatch]) // Dependencies for this effect

    return (
        <div>
            {/* Displays the checkout steps navigation */}
            <CheckoutSteps step1 step2 step3 step4 />

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        {/* Shipping Details Section */}
                        <ListGroup.Item className='mb-3'>
                            <h2>Shipping</h2>
                            {
                                cart.shippingAddress.address ? (
                                    <p>
                                        <strong>Shipping: </strong>
                                        {cart.shippingAddress.country}, {cart.shippingAddress.city}, {cart.shippingAddress.address} /
                                        Postal Code: {cart.shippingAddress.postalCode}
                                    </p>
                                ) : (
                                    <Message variant='warning' text='Shipping address not entered!' />
                                )
                            }
                        </ListGroup.Item>

                        {/* Payment Method Section */}
                        <ListGroup.Item className='mb-3'>
                            <h2>Payment Method</h2>
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

                        {/* Order Items Section */}
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {
                                cart.cartItems.length === 0 ? (
                                    <Message variant='warning' text='Your cart is empty!' />
                                ) : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index} className='my-3 text-center'>
                                                <Row>
                                                    {/* Item Image */}
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid />
                                                    </Col>
                                                    {/* Item Name */}
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    {/* Item Quantity and Total Price */}
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
                    {/* Order Summary Section */}
                    <Card>
                        <ListGroup varian='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Loader for Order Creation */}
                            {loading && (
                                <ListGroup.Item>
                                    <Loader />
                                </ListGroup.Item>
                            )}

                            {/* Error Message for Order Creation */}
                            {error && (
                                <ListGroup.Item>
                                    <Message variant='danger' text={error} />
                                </ListGroup.Item>
                            )}

                            {/* Place Order Button */}
                            <ListGroup.Item className={loading && 'd-none'}>
                                <Button
                                    type='button'
                                    className='btn btn-block w-100'
                                    disabled={cart.cartItems.length === 0} // Disable button if cart is empty
                                    onClick={placeOrder} // Trigger order creation
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
