import React from 'react'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../redux/features/User/userThunk'


function RegisterScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const redirect = urlParams.get('redirect') ? urlParams.get('redirect') : '/'


    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [message, setMessage] = React.useState('')

    const { success, loading, error } = useSelector(state => state.userRegister)
    const { userInfo } = useSelector(state => state.userLogin)

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match !')
        } else {
            setMessage('')
            dispatch(register({ name, email, password }))
        }
    }

    React.useEffect(() => {
        if (success || (userInfo && userInfo.email)) {
            navigate(redirect)
        }
    }, [success, userInfo, redirect, navigate])



    return (
        <FormContainer>
            <h1 className='mt-4'>sign up</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger' text={error} />
                    : message ? <Message variant='warning' text={message} />
                        : <></>}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mt-4">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mt-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mt-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mt-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Button
                    disabled={loading === true}
                    type='submit'
                    className='mt-4 col-4'>sign up</Button>
            </Form>
            <Row className='my-4'>
                <Col>
                    Have an account ?
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    >Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen