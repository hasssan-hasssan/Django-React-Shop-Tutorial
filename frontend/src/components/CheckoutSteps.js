import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <div>
            <Nav>
                <Nav.Item>
                    {step1 ? (
                        <LinkContainer to={{ pathname: '/login', search: '?redirect=/shipping' }}>
                            <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                    ) : (
                        <Nav.Link disabled>Login</Nav.Link>
                    )}
                </Nav.Item>
                <Nav.Item>
                    {step2 ? (
                        <LinkContainer to='/shipping'>
                            <Nav.Link>Shipping</Nav.Link>
                        </LinkContainer>
                    ) : (
                        <Nav.Link disabled>Shipping</Nav.Link>
                    )}
                </Nav.Item>
                <Nav.Item>
                    {step3 ? (
                        <LinkContainer to='/payment'>
                            <Nav.Link>Payment</Nav.Link>
                        </LinkContainer>
                    ) : (
                        <Nav.Link disabled>Payment</Nav.Link>
                    )}
                </Nav.Item>
                <Nav.Item>
                    {step4 ? (
                        <LinkContainer to='/placeorder'>
                            <Nav.Link>PlaceOrder</Nav.Link>
                        </LinkContainer>
                    ) : (
                        <Nav.Link disabled>PlaceOrder</Nav.Link>
                    )}
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default CheckoutSteps