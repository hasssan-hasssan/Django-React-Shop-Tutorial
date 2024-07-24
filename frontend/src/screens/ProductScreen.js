import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, Button, ListGroup } from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'


function ProductScreen() {
    let { id } = useParams()

    const [product, setProduct] = useState({})


    useEffect(() => {

        async function fetchProduct() {
            const { data } = await axios.get(`/api/v1/products/${id}`)
            setProduct(data)
        }

        fetchProduct()
    }, [])

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            <Row>
                <Col xs={12} md={5} lg={5} xl={5} className='text-center'>
                    <Image src={product.image} className='w-75' />
                </Col>
                <Col xs={12} md={7} lg={7} xl={7}>
                    <Row className='my-4'>
                        <Col xs={12} md={6} lg={6} xl={6}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h5>{product.name}</h5>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={` ${product.numReviews} reviews`} color={"#F8E825"} />
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col xs={12} md={6} lg={6} xl={6}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price: </Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status: </Col>
                                        <Col>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button className='w-100' disabled={product.countInStock === 0}>add to cart</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col>
                            <strong>Description: </strong>
                            {product.description}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen