import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

// This component displays the steps of a checkout process (Login, Shipping, Payment, PlaceOrder).
// Each step is conditionally rendered as active (clickable) or disabled, depending on props passed.

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <div>
            {/* Navigation bar for the checkout steps */}
            <Nav className='justify-content-center py-3 mb-3'>

                {/* Step 1: Login */}
                <Nav.Item>
                    {step1 ? (
                        // If 'step1' is true, show a clickable link to the login page.
                        <LinkContainer to={{ pathname: '/login', search: '?redirect=/shipping' }}>
                            <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                    ) : (
                        // Otherwise, show a disabled login link.
                        <Nav.Link disabled>Login</Nav.Link>
                    )}
                </Nav.Item>

                {/* Step 2: Shipping */}
                <Nav.Item>
                    {step2 ? (
                        // If 'step2' is true, show a clickable link to the shipping page.
                        <LinkContainer to='/shipping'>
                            <Nav.Link>Shipping</Nav.Link>
                        </LinkContainer>
                    ) : (
                        // Otherwise, show a disabled shipping link.
                        <Nav.Link disabled>Shipping</Nav.Link>
                    )}
                </Nav.Item>

                {/* Step 3: Payment */}
                <Nav.Item>
                    {step3 ? (
                        // If 'step3' is true, show a clickable link to the payment page.
                        <LinkContainer to='/payment'>
                            <Nav.Link>Payment</Nav.Link>
                        </LinkContainer>
                    ) : (
                        // Otherwise, show a disabled payment link.
                        <Nav.Link disabled>Payment</Nav.Link>
                    )}
                </Nav.Item>

                {/* Step 4: Place Order */}
                <Nav.Item>
                    {step4 ? (
                        // If 'step4' is true, show a clickable link to the place order page.
                        <LinkContainer to='/placeorder'>
                            <Nav.Link>PlaceOrder</Nav.Link>
                        </LinkContainer>
                    ) : (
                        // Otherwise, show a disabled place order link.
                        <Nav.Link disabled>PlaceOrder</Nav.Link>
                    )}
                </Nav.Item>

            </Nav>
        </div>
    )
}

// Exporting the CheckoutSteps component so it can be used in other parts of the app.
export default CheckoutSteps
