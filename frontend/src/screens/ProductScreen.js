import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, Button, ListGroup, ButtonGroup, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductDetails } from '../redux/features/Product/productThunk'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addItem } from '../redux/features/Cart/cartSlice'


// The ProductScreen component displays detailed information about a single product.
// Users can view the product image, description, price, availability, and adjust the quantity before adding it to the cart.

function ProductScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch
    const navigate = useNavigate() // Allows programmatic navigation to other routes

    // Extract the product ID from the URL parameters
    let { id } = useParams()

    // Retrieve product details from the Redux state
    const { loading, error, product } = useSelector(state => state.productDetails)

    // Local state to manage the selected quantity
    const [qty, setQty] = useState(1)

    // Updates the product quantity by incrementing or decrementing
    const updateQty = (value) => {
        setQty(prevState => prevState + value) // Ensures controlled state changes
    }

    // Handles adding the product to the cart
    const addToCartHandler = () => {
        // Dispatch the addItem action with product details and selected quantity
        dispatch(addItem({
            product: id, // Product ID
            name: product.name, // Product name
            image: product.image, // Product image URL
            price: product.price, // Product price
            countInStock: product.countInStock, // Available stock
            qty, // Selected quantity
        }))
        navigate('/cart') // Navigate to the cart page after adding the product
    }

    // Fetch product details when the component mounts or when the product ID changes
    useEffect(() => {
        dispatch(fetchProductDetails(id)) // Dispatch the fetchProductDetails action
    }, [dispatch, id]) // Dependencies for this effect

    return (
        <div>
            {/* Back button to navigate to the previous page */}
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>

            {/* Show a loader, error message, or product details based on the state */}
            {loading ? (
                <Loader /> // Loader component while fetching product details
            ) : error ? (
                <Message variant='danger' text={error} /> // Error message if fetching fails
            ) : (
                <Row>
                    {/* Product Image Section */}
                    <Col xs={12} md={5} lg={5} xl={5} className='text-center'>
                        <Image src={product.image} className='w-75' /> {/* Display product image */}
                    </Col>

                    {/* Product Details Section */}
                    <Col xs={12} md={7} lg={7} xl={7}>
                        <Row className='my-4'>
                            <Col xs={12} md={6} lg={6} xl={6}>
                                <ListGroup variant='flush'>
                                    {/* Product Name */}
                                    <ListGroup.Item>
                                        <h5>{product.name}</h5>
                                    </ListGroup.Item>

                                    {/* Product Rating and Review Count */}
                                    <ListGroup.Item>
                                        <Rating
                                            value={product.rating}
                                            text={` ${product.numReviews} reviews`}
                                            color={"#F8E825"}
                                        />
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>

                            <Col xs={12} md={6} lg={6} xl={6}>
                                <ListGroup variant='flush'>
                                    {/* Product Price */}
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${product.price}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {/* Product Stock Status */}
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {/* Quantity Selector */}
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty:</Col>
                                                <Col>
                                                    <ButtonGroup size='sm'>
                                                        {/* Decrease Quantity Button */}
                                                        <Button
                                                            disabled={qty === 1} // Disable if quantity is 1
                                                            onClick={() => updateQty(-1)} // Decrease quantity
                                                            size='sm'
                                                        >
                                                            <i className="fa-solid fa-minus"></i>
                                                        </Button>

                                                        {/* Display Selected Quantity */}
                                                        <Form.Control
                                                            value={qty}
                                                            size='sm'
                                                            readOnly
                                                        />

                                                        {/* Increase Quantity Button */}
                                                        <Button
                                                            disabled={qty === product.countInStock} // Disable if quantity reaches stock limit
                                                            onClick={() => updateQty(+1)} // Increase quantity
                                                            size='sm'
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    {/* Add to Cart Button */}
                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler} // Add product to cart
                                            className='w-100'
                                            disabled={product.countInStock === 0} // Disable if out of stock
                                        >
                                            add to cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>

                        {/* Product Description Section */}
                        <Row className='mb-4'>
                            <Col>
                                <strong>Description: </strong>
                                {product.description}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default ProductScreen
