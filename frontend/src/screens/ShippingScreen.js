import React from 'react'
import FormContainer from '../components/FormContainer'
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../redux/features/Cart/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

function ShippingScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { shippingAddress } = useSelector(state => state.cart)

    const [postalCode, setPostalCode] = React.useState(shippingAddress.postalCode)
    const [address, setAddress] = React.useState(shippingAddress.address)
    const [city, setCity] = React.useState(shippingAddress.city)
    const [country, setCountry] = React.useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ postalCode, address, city, country }))
        navigate('/payment')
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1 className='mt-4'>shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='postalCode' className='mt-4'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your postal code ...'
                        value={postalCode ? postalCode : ''}
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='address' className='mt-4'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your address ...'
                        value={address ? address : ''}
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className='mt-4'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your city ...'
                        value={city ? city : ''}
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='mt-4'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your country ...'
                        value={country ? country : ''}
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button type='submit' className='mt-4 col-4'>continue</Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen