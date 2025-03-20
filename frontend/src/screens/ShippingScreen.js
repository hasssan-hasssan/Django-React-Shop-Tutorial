import React from 'react'
import FormContainer from '../components/FormContainer'
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../redux/features/Cart/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'


// The ShippingScreen component allows users to input their shipping information.
// It saves the entered details to Redux and navigates to the PaymentScreen.

function ShippingScreen() {
    const dispatch = useDispatch() // Provides access to the Redux dispatch function
    const navigate = useNavigate() // Enables navigation to other routes

    // Retrieves the existing shipping address from Redux state, if available
    const { shippingAddress } = useSelector(state => state.cart)

    // Local state for managing the user's shipping input fields, pre-filled with existing data if available
    const [postalCode, setPostalCode] = React.useState(shippingAddress.postalCode) // Postal code field
    const [address, setAddress] = React.useState(shippingAddress.address) // Address field
    const [city, setCity] = React.useState(shippingAddress.city) // City field
    const [country, setCountry] = React.useState(shippingAddress.country) // Country field

    // Handles form submission
    const submitHandler = (e) => {
        e.preventDefault() // Prevents the default form submission behavior
        // Dispatches the saveShippingAddress action with the entered values
        dispatch(saveShippingAddress({ postalCode, address, city, country }))
        // Navigates to the PaymentScreen after saving the shipping address
        navigate('/payment')
    }

    return (
        <FormContainer>
            {/* Displays the checkout steps navigation */}
            <CheckoutSteps step1 step2 />
            
            {/* Page heading */}
            <h1 className='mt-4'>Shipping</h1>
            
            {/* Shipping form */}
            <Form onSubmit={submitHandler}>
                {/* Postal Code Input Field */}
                <Form.Group controlId='postalCode' className='mt-4'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your postal code ...'
                        value={postalCode ? postalCode : ''} // Controlled input field
                        onChange={(e) => setPostalCode(e.target.value)} // Updates the postal code state
                    ></Form.Control>
                </Form.Group>

                {/* Address Input Field */}
                <Form.Group controlId='address' className='mt-4'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your address ...'
                        value={address ? address : ''} // Controlled input field
                        onChange={(e) => setAddress(e.target.value)} // Updates the address state
                    ></Form.Control>
                </Form.Group>

                {/* City Input Field */}
                <Form.Group controlId='city' className='mt-4'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your city ...'
                        value={city ? city : ''} // Controlled input field
                        onChange={(e) => setCity(e.target.value)} // Updates the city state
                    ></Form.Control>
                </Form.Group>

                {/* Country Input Field */}
                <Form.Group controlId='country' className='mt-4'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your country ...'
                        value={country ? country : ''} // Controlled input field
                        onChange={(e) => setCountry(e.target.value)} // Updates the country state
                    ></Form.Control>
                </Form.Group>

                {/* Submit Button */}
                <Button type='submit' className='mt-4 col-4'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
