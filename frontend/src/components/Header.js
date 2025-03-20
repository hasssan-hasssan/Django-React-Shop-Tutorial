import React from 'react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/features/User/userThunk'

function Header() {
    // useDispatch is used to trigger Redux actions, e.g., logging out the user.
    const dispatch = useDispatch()
    // useSelector retrieves the user information from the Redux state (e.g., user's login status).
    const { userInfo } = useSelector(state => state.userLogin)

    // Handler function for logging out the user.
    const logoutHandler = () => {
        // Dispatches the 'logout' action to update the application's state.
        dispatch(logout())
    }

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                {/* E-Shop logo or brand name that links to the home page */}
                <LinkContainer to='/'>
                    <Navbar.Brand>E-Shop</Navbar.Brand>
                </LinkContainer>

                {/* Toggle button for collapsing the navigation menu on smaller screens */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Collapsible navigation section */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Cart link */}
                        <LinkContainer to='/cart'>
                            <Nav.Link><i className='fas fa-cart-shopping'></i>cart</Nav.Link>
                        </LinkContainer>

                        {/* Conditional rendering: Show either user dropdown or login link */}
                        {userInfo && userInfo.email ? (
                            // User is logged in: Show dropdown with user's email, profile link, and logout option.
                            <NavDropdown title={userInfo.email} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                {/* Logout option triggers the logoutHandler */}
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            // User is not logged in: Show login link.
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
