import React from 'react'
import { Card } from 'react-bootstrap'


function Product({ product }) {
    return (
        <Card className='p-3 my-3 rounded'>
            <Card.Img src={product.image} className='card-img-top' />
            <Card.Body>
                <Card.Title as='h5' className='mt-3'>
                    <strong>{product.name}</strong>
                </Card.Title>
                <Card.Text className='my-3'>
                    {product.rating} from {product.numReviews} reviews
                </Card.Text>
                <Card.Text as='h4'>
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product