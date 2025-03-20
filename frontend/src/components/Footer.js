import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'


// Footer is a simple functional component used to display a footer section at the bottom of the page.

function Footer() {
    return (
        // The outer container sets the background color and ensures the footer spans the full width of the screen.
        <Container className='bg-dark' fluid>
            <Row>
                {/* A single column that centers the text, adds padding, and displays the text in white. */}
                <Col className='text-center py-3 text-white'>
                    {/* Copyright notice with the © symbol and the brand name */}
                    Copyright &copy; E-Shop
                </Col>
            </Row>
        </Container>
    )
}

// Exporting Footer for use in other parts of the app
export default Footer
