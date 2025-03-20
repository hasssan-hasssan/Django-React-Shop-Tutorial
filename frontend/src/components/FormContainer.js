import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// FormContainer is a reusable component for wrapping form elements.
// It centers the form on the screen and ensures responsive styling.

function FormContainer({ children }) {
    return (
        <Container>
            {/* A row in the container that is centered horizontally for medium-sized screens */}
            <Row className='justify-content-md-center'>
                {/* A column taking up the full width on extra-small screens and half width on medium screens */}
                <Col xs={12} md={6}>
                    {/* The children prop allows any content (forms, inputs, etc.) to be passed into this component */}
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

// Exporting the FormContainer component for use in other parts of the app
export default FormContainer;
