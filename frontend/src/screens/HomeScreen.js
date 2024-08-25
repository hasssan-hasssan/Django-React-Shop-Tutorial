import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { fetchProducts } from '../redux/features/Product/productThunk'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'

function HomeScreen() {
    const dispatch = useDispatch()
    const { loading, error, products } = useSelector(state => state.listProduct)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [])


    return (
        <div>
            <h1 className='py-4'>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger' text={error} />
                    : (
                        <Row>
                            {products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
        </div>
    )
}

export default HomeScreen