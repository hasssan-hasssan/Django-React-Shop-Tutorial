import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'


function Product({ product }) {
    return (
        <Card className='p-3 my-3 rounded'>
            <Card.Img src={product.image} className='card-img-top' />
            <Card.Body>
                <Card.Title as='h5' className='mt-3'>
                    <strong>{product.name}</strong>
                </Card.Title>
                <Card.Text className='my-3'>
                    <Rating value={product.rating} text={` ${product.numReviews} reviews`} color={"#F8E825"} />
                </Card.Text>
                <Card.Text as='h4'>
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product