import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'


// The Product component displays the details of a single product, such as its image, name, rating, and price.

function Product({ product }) {
    return (
        <Card className='p-3 my-3 rounded'>
            {/* Clicking on the product image redirects the user to the product detail page using the product's ID */}
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} className='card-img-top' />
            </Link>
            <Card.Body>
                {/* Product name displayed as a title */}
                <Card.Title as='h5' className='mt-3'>
                    {/* Clicking on the product name also redirects to the product detail page */}
                    <Link to={`/product/${product._id}`}>
                        <strong>{product.name}</strong>
                    </Link>
                </Card.Title>
                {/* Displays the product's rating and the number of reviews */}
                <Card.Text className='my-3'>
                    <Rating
                        value={product.rating} // The product's rating value (e.g., 4.5 stars)
                        text={` ${product.numReviews} reviews`} // Text displaying the number of reviews
                        color={"#F8E825"} // The color of the stars in the rating component
                    />
                </Card.Text>
                {/* Displays the product's price in bold format */}
                <Card.Text as='h4'>
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

// Exporting the Product component for use in other parts of the app
export default Product
