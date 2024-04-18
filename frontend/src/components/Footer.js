import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'


function Footer() {
    return (
        <Container className='bg-dark' fluid>
            <Row>
                <Col className='text-center py-3 text-white'>Copyright &copy; E-Shop</Col>
            </Row>
        </Container>
    )
}

export default Footer