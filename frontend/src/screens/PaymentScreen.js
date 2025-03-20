import React from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../redux/features/Cart/cartSlice'


// The PaymentScreen component manages the selection of a payment method during the checkout process.
// It uses Redux to retrieve shipping and payment information and navigates users through the checkout steps.

function PaymentScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch
    const navigate = useNavigate() // Allows programmatic navigation (e.g., redirecting to /placeorder)

    // Extracts shippingAddress and paymentMethod from the Redux cart state
    const { shippingAddress, paymentMethod } = useSelector(state => state.cart)

    // Local state to manage the selected payment method
    const [paymentMethodChoice, setPaymentMethodChoice] = React.useState(paymentMethod)

    // Handles form submission
    const submitHandler = (e) => {
        e.preventDefault() // Prevents the default form submission behavior
        dispatch(savePaymentMethod(paymentMethodChoice)) // Dispatches the savePaymentMethod action with the selected method
        navigate('/placeorder') // Navigates to the place order page
    }

    // Redirects users to the shipping page if shippingAddress is missing
    React.useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping') // Redirects to the shipping page
        }
    }, [shippingAddress, navigate]) // Dependencies for this effect to trigger when shippingAddress or navigate changes

    return (
        <FormContainer>
            {/* Displays the checkout steps indicating progress */}
            <CheckoutSteps step1 step2 step3 />
            <h1 className='mt-4'>Payment Method</h1>

            {/* Payment method selection form */}
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label>Select Method</Form.Label>
                    {/* Radio button for 'IdPay' payment method */}
                    <Form.Check
                        name='paymentMethod'
                        id='idpay' // Unique ID for this payment method
                        label='IdPay' // Label displayed to users
                        type='radio' // Defines this input as a radio button
                        onChange={(e) => setPaymentMethodChoice(e.target.id)} // Updates state when selected
                        className='py-4'
                        checked={paymentMethodChoice === 'idpay'} // Checks this option if it matches the current state
                    ></Form.Check>
                    {/* Radio button for 'Zibal' payment method */}
                    <Form.Check
                        name='paymentMethod'
                        id='zibal' // Unique ID for this payment method
                        label='Zibal' // Label displayed to users
                        type='radio' // Defines this input as a radio button
                        onChange={(e) => setPaymentMethodChoice(e.target.id)} // Updates state when selected
                        className='py-4'
                        checked={paymentMethodChoice === 'zibal'} // Checks this option if it matches the current state
                    ></Form.Check>
                </Form.Group>

                {/* Continue button to submit the form */}
                <Button
                    type='submit'
                    className='col-4 mt-4'
                    disabled={paymentMethodChoice === ''} // Disables the button if no payment method is selected
                >
                    continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
