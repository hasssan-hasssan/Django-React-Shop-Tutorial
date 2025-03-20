import React from 'react'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../redux/features/User/userThunk'
import { getRedirectParam } from '../utils/utils'


// The RegisterScreen component allows users to create a new account by providing their name, email, and password.
// It also redirects logged-in users or newly registered users based on the current URL's `redirect` query parameter.

function RegisterScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch for state management
    const navigate = useNavigate() // Enables navigation programmatically

    // Extract the redirect query parameter from the URL
    const queryString = window.location.search // Get the query string from the URL
    const urlParams = new URLSearchParams(queryString) // Parse the query string
    const redirect = getRedirectParam(urlParams) // Extract the `redirect` parameter or default to '/'

    // Local state to manage user input fields and messages
    const [name, setName] = React.useState('') // User's full name
    const [email, setEmail] = React.useState('') // User's email
    const [password, setPassword] = React.useState('') // User's password
    const [confirmPassword, setConfirmPassword] = React.useState('') // Confirm password input
    const [message, setMessage] = React.useState('') // Warning/error message for invalid input
    const [emailMsg, setEmailMsg] = React.useState('') // Success message for email-based registration

    // Retrieve registration and login state from Redux
    const { success, loading, error, userInfo } = useSelector(state => state.userRegister) // Registration state
    const { userInfo: user } = useSelector(state => state.userLogin) // Login state

    // Handle the form submission for user registration
    const submitHandler = (e) => {
        e.preventDefault() // Prevent the default form submission behavior
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!') // Show a warning if passwords don't match
        } else {
            setMessage('') // Clear the warning
            dispatch(register({ name, email, password })) // Dispatch the register action with user data
        }
    }

    // Reset local state for input fields and messages
    const resetStates = () => {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setMessage('')
    }

    // Redirect logged-in or registered users to the specified redirect URL
    React.useEffect(() => {
        if (user && user.email) {
            navigate(redirect) // Redirect if the user is already logged in
        }
        if (userInfo && userInfo.detail) {
            setEmailMsg(userInfo.detail) // Show a success message if registration was successful
            resetStates() // Clear input fields
        }
    }, [success, userInfo, redirect, navigate, user]) // Dependencies for the useEffect

    return (
        <FormContainer>
            {/* Page heading */}
            <h1 className='mt-4'>Sign Up</h1>

            {/* Conditional rendering for loading, error, or success messages */}
            {loading ? (
                <Loader /> // Show a loader while registration is in progress
            ) : error ? (
                <Message variant='danger' text={error} /> // Show an error message if registration fails
            ) : message ? (
                <Message variant='warning' text={message} /> // Show a warning for invalid input
            ) : emailMsg ? (
                <Message variant='success' text={emailMsg} /> // Show a success message for registration
            ) : (
                <></>
            )}

            {/* Registration form */}
            <Form onSubmit={submitHandler}>
                {/* Full Name Input */}
                <Form.Group className="mt-4">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name} // Controlled input for the name
                        onChange={(e) => setName(e.target.value)} // Update name state
                    ></Form.Control>
                </Form.Group>

                {/* Email Input */}
                <Form.Group className="mt-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email} // Controlled input for the email
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        required // Email is required
                    ></Form.Control>
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mt-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your password'
                        value={password} // Controlled input for the password
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required // Password is required
                    ></Form.Control>
                </Form.Group>

                {/* Confirm Password Input */}
                <Form.Group className="mt-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm your password'
                        value={confirmPassword} // Controlled input for the confirm password
                        onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                        required // Confirm password is required
                    ></Form.Control>
                </Form.Group>

                {/* Submit Button */}
                <Button
                    disabled={loading === true} // Disable button if loading
                    type='submit'
                    className='mt-4 col-4'
                >
                    Sign Up
                </Button>
            </Form>

            {/* Login Link */}
            <Row className='my-4'>
                <Col>
                    Have an account? {/* Link to the login page with the redirect parameter */}
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    >
                        Login
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
