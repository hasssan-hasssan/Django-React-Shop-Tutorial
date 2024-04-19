import React from 'react'
import { Row, Col } from 'react-bootstrap'
import products from '../products'

function HomeScreen() {
    return (
        <div>
            <h1 className='py-4'>Latest Products</h1>
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <h3>{product.name}</h3>
                        <hr />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default HomeScreen