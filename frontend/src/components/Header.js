import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'

function Header() {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">E-Shop</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/cart"><i className='fas fa-cart-shopping'></i>cart</Nav.Link>
                        <Nav.Link href="/login"><i className='fas fa-user'></i>login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header