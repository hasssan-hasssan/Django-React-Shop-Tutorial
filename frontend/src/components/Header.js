import React from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/features/User/userThunk'

function Header() {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.userLogin)
    const logoutHandler = () => {
        dispatch(logout())
    }
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
                        {userInfo && userInfo.email ? (
                            <NavDropdown title={userInfo.email} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to='/login'>
                                <Nav.Link><i className='fas fa-user'></i>login</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header