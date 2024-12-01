import React from 'react'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/features/User/userThunk'

function LoginScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // get query paramters from current page url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const redirect = urlParams.get('redirect') ? urlParams.get('redirect') : '/'
    const token = urlParams.get('token') ? urlParams.get('token') : ''

    // defind local state to get user inputs
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [activationMsg, setActivationMsg] = React.useState('')

    // fetch user information from redux store
    const { userInfo, loading, error } = useSelector(state => state.userLogin)


    // submit form
    const submitHandler = (e) => {
        e.preventDefault()
        // dispatch login action. passing email and password as an object
        // because the secound parameter is thunkAPIs
        dispatch(login({ email, password }))
    }

    React.useEffect(() => {
        if (userInfo && userInfo.email) {
            // if userInfo and userInfo.email exist 
            // it means user is authenticated we should redirect the user
            navigate(redirect)
        }
        if (token !== '') {
            switch (token) {
                case 'valid':
                    setActivationMsg('Your account activated. Now you can login.')
                    break;
                case 'invalid':
                    setActivationMsg('Your activation link is invalid. Please goto register page and try again.')
                    break;
                default:
                    break;
            }
        }
    }, [userInfo, navigate, redirect, token])

    return (
        <FormContainer>
            <h1 className='mt-4'>sign in</h1>
            {
                loading ? <Loader />
                    : error ? <Message variant='danger' text={error} />
                        : token === 'valid' ? <Message variant='success' text={activationMsg} />
                            : token === 'invalid' ? <Message variant='danger' text={activationMsg} />
                                : <></>
            }
            <Form onSubmit={submitHandler}>
                <Form.Group className='mt-4'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mt-4'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Button
                    type='submit'
                    className='mt-4 col-4'
                >
                    sign in
                </Button>
            </Form>

            <Row className='my-4'>
                New Customer ?
                <Col>
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen