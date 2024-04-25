import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Header() {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>E-Shop</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to='/cart'>
                            <Nav.Link><i className='fas fa-cart-shopping'></i>cart</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/login'>
                            <Nav.Link><i className='fas fa-user'></i>login</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header