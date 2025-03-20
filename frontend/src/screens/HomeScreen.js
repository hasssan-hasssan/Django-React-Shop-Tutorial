import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { fetchProducts } from '../redux/features/Product/productThunk'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'


// The HomeScreen component displays the homepage with the latest products.
// It fetches the product list from the Redux store and displays a loading spinner,
// an error message, or the list of products based on the state.

function HomeScreen() {
    const dispatch = useDispatch() // Provides access to the Redux dispatch function
    const { loading, error, products } = useSelector(state => state.listProduct) // Extracts loading, error, and products from the Redux state

    useEffect(() => {
        // Fetches the list of products when the component is mounted
        dispatch(fetchProducts())
    }, [dispatch]) // Ensures the dispatch function is passed as a dependency

    return (
        <div>
            {/* Page heading */}
            <h1 className='py-4'>Latest Products</h1>

            {/* Conditionally render content based on the state */}
            {loading ? (
                // Show the Loader component when loading is true
                <Loader />
            ) : error ? (
                // Show the Message component with an error message if an error exists
                <Message variant='danger' text={error} />
            ) : (
                // Display the list of products in a responsive grid layout
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            {/* Render the Product component for each product */}
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}

export default HomeScreen
