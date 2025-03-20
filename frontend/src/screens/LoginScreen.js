import React from 'react'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/features/User/userThunk'
import { getRedirectParam } from '../utils/utils'


// The LoginScreen component handles the login functionality.
// It retrieves query parameters, manages local state for inputs, and dispatches login actions.

function LoginScreen() {
    const dispatch = useDispatch() // Provides access to the Redux dispatch function
    const navigate = useNavigate() // Used for navigation (e.g., redirecting after login)

    // Retrieve query parameters from the current URL
    const queryString = window.location.search // Get the query string from the URL
    const urlParams = new URLSearchParams(queryString) // Parse the query string
    const redirect = getRedirectParam(urlParams) // Get the 'redirect' parameter or default to '/'
    const token = urlParams.get('token') ? urlParams.get('token') : '' // Get the 'token' parameter, if present

    // Define local state for storing user inputs
    const [email, setEmail] = React.useState('') // User's email input
    const [password, setPassword] = React.useState('') // User's password input
    const [activationMsg, setActivationMsg] = React.useState('') // Activation message based on the token

    // Access login-related state from Redux store
    const { userInfo, loading, error } = useSelector(state => state.userLogin)

    // Handles form submission
    const submitHandler = (e) => {
        e.preventDefault() // Prevents default form submission behavior
        // Dispatches the login action with email and password as payload
        dispatch(login({ email, password }))
    }

    // Effect to handle redirection and token-based logic
    React.useEffect(() => {
        if (userInfo && userInfo.email) {
            // If userInfo is present, the user is authenticated; redirect them
            navigate(redirect)
        }
        if (token !== '') {
            // Display activation messages based on token value
            switch (token) {
                case 'valid':
                    setActivationMsg('Your account is activated. Now you can log in.')
                    break
                case 'invalid':
                    setActivationMsg('Your activation link is invalid. Please go to the register page and try again.')
                    break
                default:
                    break
            }
        }
    }, [userInfo, navigate, redirect, token]) // Dependencies for the effect

    return (
        <FormContainer>
            {/* Page heading */}
            <h1 className='mt-4'>sign in</h1>
            {/* Display loading spinner, error messages, or activation messages */}
            {
                loading ? <Loader /> // Show loader during login process
                    : error ? <Message variant='danger' text={error} /> // Display error message if login fails
                        : token === 'valid' ? <Message variant='success' text={activationMsg} /> // Show activation success
                            : token === 'invalid' ? <Message variant='danger' text={activationMsg} /> // Show activation failure
                                : <></> // Render nothing if no condition is met
            }
            {/* Login form */}
            <Form onSubmit={submitHandler}>
                {/* Email Input Field */}
                <Form.Group className='mt-4'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email address'
                        value={email} // Bind input value to state
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                        required
                    ></Form.Control>
                </Form.Group>
                {/* Password Input Field */}
                <Form.Group className='mt-4'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your password'
                        value={password} // Bind input value to state
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                        required
                    ></Form.Control>
                </Form.Group>
                {/* Submit Button */}
                <Button
                    type='submit'
                    className='mt-4 col-4'
                >
                    sign in
                </Button>
            </Form>

            {/* Register Link for New Customers */}
            <Row className='my-4'>
                New Customer ?
                <Col>
                    {/* Redirect to register page, retaining the redirect query parameter */}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
