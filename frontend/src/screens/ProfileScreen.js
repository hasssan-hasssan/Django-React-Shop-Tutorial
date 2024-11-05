import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserDetails } from '../redux/features/User/userThunk'

function ProfileScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [message, setMessage] = React.useState('')


    const { userInfo } = useSelector(state => state.userLogin)
    const {
        user,
        success: successUserDetails,
        loading: loadingUserDetails,
        error: errorUserDetails,
    } = useSelector(state => state.userDetails)


    React.useEffect(() => {
        if (!userInfo.email) {
            navigate('/login?redirect=/profile')
        } else {
            if (!successUserDetails && !user.email) {
                dispatch(getUserDetails('profile'))
            } else {
                setEmail(user.email)
                setName(user.name)
            }
        }
    }, [userInfo, navigate, dispatch, successUserDetails])
    return (
        <Row>
            <Col md={3}>
                <h2 className='mt-4'>my profile</h2>
                {/* {loading ? <Loader />
                : error ? <Message variant='danger' text={error} />
                    : message ? <Message variant='warning' text={message} />
                        : <></>} */}
                <Form>
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
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm your password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button
                        // disabled={loading === true}
                        type='submit'
                        className='mt-4 col-6'>update</Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2 className='mt-4'>my orders</h2>
            </Col>
        </Row>
    )
}

export default ProfileScreen