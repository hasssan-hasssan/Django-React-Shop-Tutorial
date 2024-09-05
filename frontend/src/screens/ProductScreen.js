import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, Button, ListGroup, ButtonGroup, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductDetails } from '../redux/features/Product/productThunk'
import Loader from '../components/Loader'
import Message from '../components/Message'


function ProductScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let { id } = useParams()
    const { loading, error, product } = useSelector(state => state.productDetails)
    const [qty, setQty] = useState(1)

    const updateQty = (value) => {
        setQty(prevState => prevState + value)
    }

    const addToCartHandler = () => {
        navigate('/cart')
    }

    useEffect(() => {
        dispatch(fetchProductDetails(id))
    }, [dispatch, id])

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ? <Loader />
                : error ? <Message variant='danger' text={error} />
                    : <Row>
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

                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty:</Col>
                                                    <Col>
                                                        <ButtonGroup size='sm'>
                                                            <Button
                                                                disabled={qty === 1}
                                                                onClick={() => updateQty(-1)}
                                                                size='sm'>
                                                                <i class="fa-solid fa-minus"></i>
                                                            </Button>
                                                            <Form.Control value={qty} size='sm' readOnly />
                                                            <Button
                                                                disabled={qty === product.countInStock}
                                                                onClick={() => updateQty(+1)}
                                                                size='sm'>
                                                                <i class="fa-solid fa-plus"></i>
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}

                                        <ListGroup.Item>
                                            <Button
                                                onClick={addToCartHandler}
                                                className='w-100'
                                                disabled={product.countInStock === 0}
                                            >
                                                add to cart</Button>
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
                    </Row>}
        </div>
    )
}

export default ProductScreen