import React from 'react'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserDetails, updateUserProfile } from '../redux/features/User/userThunk'
import { reset } from '../redux/features/User/userSlice'
import { getMyOrderList } from '../redux/features/Order/orderThunk'
import { LinkContainer } from 'react-router-bootstrap'
import { beautifulDate } from '../utils/utils'

function ProfileScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [successUpdate, setSuccessUpdate] = React.useState('')


    const { userInfo } = useSelector(state => state.userLogin)
    const {
        user,
        success: successUserDetails,
        loading: loadingUserDetails,
        error: errorUserDetails,
    } = useSelector(state => state.userDetails)
    const {
        loading: loadingUserUpdateProfile,
        success: successUserUpdateProfile,
        error: errorUserUpdateProfile,
    } = useSelector(state => state.userUpdateProfile)

    const {
        loading: loadingMyOrders,
        error: errorMyOrders,
        orders
    } = useSelector(state => state.orderListMy)

    React.useEffect(() => {
        if (!userInfo.email) {
            navigate('/login?redirect=/profile')
        } else {
            if ((!successUserDetails && !user.email) || successUserUpdateProfile) {
                dispatch(reset()) // reset userUpdateProfileSlice
                dispatch(getUserDetails('profile'))
                setTimeout(() => {
                    dispatch(getMyOrderList())
                }, 2000)
            } else {
                setEmail(user.email)
                setName(user.name)
            }
        }
    }, [userInfo, navigate, dispatch, successUserDetails, successUserUpdateProfile])

    const resetStates = () => {
        setPassword('')
        setConfirmPassword('')
        setMessage('')
    }


    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match !')
        } else {
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            resetStates()
            setSuccessUpdate('Profile successfully updated !')
        }
    }


    return (
        <Row>
            <Col md={3}>
                <h2 className='mt-4'>my profile</h2>
                {loadingUserDetails || loadingUserUpdateProfile ? <Loader />
                    : errorUserDetails ? <Message variant='danger' text={errorUserDetails} />
                        : errorUserUpdateProfile ? <Message variant='danger' text={errorUserUpdateProfile} />
                            : message ? <Message variant='warning' text={message} />
                                : successUpdate ? <Message variant='success' text={successUpdate} />
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
                            readOnly
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
                        disabled={loadingUserDetails || loadingUserUpdateProfile === true}
                        type='submit'
                        className='mt-4 col-6'>update</Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2 className='mt-4'>my orders</h2>
                {
                    loadingMyOrders ? (
                        <Loader />
                    ) : errorMyOrders ? (
                        <Message variant='danger' text={errorMyOrders} />
                    ) : orders && orders.length === 0 ? (
                        <Loader />
                    ) : (
                        <Table striped responsive className='text-center' size='sm'>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>date</th>
                                    <th>total</th>
                                    <th>paid</th>
                                    <th>delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map(order => (
                                        <tr
                                            key={order._id}
                                            className='align-middle'
                                        >
                                            <td>#{order._id}</td>
                                            <td>{beautifulDate(order.createdAt)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {
                                                    order.isPaid ?
                                                        beautifulDate(order.paidAt) : (
                                                            <i className='fas fa-times text-danger'></i>
                                                        )
                                                }
                                            </td>
                                            <td>
                                                {
                                                    order.isDelivered ?
                                                        beautifulDate(order.deliveredAt) : (
                                                            <i className='fas fa-times text-danger'></i>
                                                        )
                                                }
                                            </td>
                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button className='btn-sm'>details</Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    )
                }
            </Col>
        </Row>
    )
}

export default ProfileScreen