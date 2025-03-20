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


// The ProfileScreen component allows users to view and update their profile details,
// including their name, email, and password. It also fetches and displays a list of the user's past orders.

function ProfileScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch
    const navigate = useNavigate() // Allows programmatic navigation

    // Local state for managing user inputs and messages
    const [name, setName] = React.useState('') // User's name
    const [email, setEmail] = React.useState('') // User's email
    const [password, setPassword] = React.useState('') // New password
    const [confirmPassword, setConfirmPassword] = React.useState('') // Confirm password
    const [message, setMessage] = React.useState('') // Warning/error message for invalid input
    const [successUpdate, setSuccessUpdate] = React.useState('') // Message for successful profile update

    // Retrieve user details and state from Redux
    const {
        user,
        success: successUserDetails,
        loading: loadingUserDetails,
        error: errorUserDetails,
    } = useSelector(state => state.userDetails)

    // Retrieve state for user profile update
    const {
        loading: loadingUserUpdateProfile,
        success: successUserUpdateProfile,
        error: errorUserUpdateProfile,
    } = useSelector(state => state.userUpdateProfile)

    // Retrieve state for the user's order history
    const {
        loading: loadingMyOrders,
        error: errorMyOrders,
        orders
    } = useSelector(state => state.orderListMy)

    // Fetch user details and order list when necessary
    React.useEffect(() => {
        if ((!successUserDetails && !user.email) || successUserUpdateProfile) {
            dispatch(reset()) // Reset the userUpdateProfile slice state
            dispatch(getUserDetails('profile')) // Fetch user details
            setTimeout(() => {
                dispatch(getMyOrderList()) // Fetch user's order history
            }, 2000) // Delay to ensure user details are updated first
        } else {
            // Populate local state with user details
            setEmail(user.email)
            setName(user.name)
        }
    }, [navigate, dispatch, successUserDetails, successUserUpdateProfile]) // Dependencies for this effect

    // Resets local state related to form inputs and messages
    const resetStates = () => {
        setPassword('')
        setConfirmPassword('')
        setMessage('')
    }

    // Handles the form submission for profile updates
    const submitHandler = (e) => {
        e.preventDefault() // Prevent default form submission
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!') // Show warning if passwords don't match
        } else {
            // Dispatch the updateUserProfile action with updated profile data
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            resetStates() // Reset input fields
            setSuccessUpdate('Profile successfully updated!') // Show success message
        }
    }

    return (
        <Row>
            {/* Profile Update Section */}
            <Col md={3}>
                <h2 className='mt-4'>My Profile</h2>
                {/* Display loading, error, or success messages */}
                {loadingUserDetails || loadingUserUpdateProfile ? (
                    <Loader />
                ) : errorUserDetails ? (
                    <Message variant='danger' text={errorUserDetails} />
                ) : errorUserUpdateProfile ? (
                    <Message variant='danger' text={errorUserUpdateProfile} />
                ) : message ? (
                    <Message variant='warning' text={message} />
                ) : successUpdate ? (
                    <Message variant='success' text={successUpdate} />
                ) : (
                    <></>
                )}
                {/* Profile Update Form */}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mt-4">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter your name'
                            value={name} // Controlled input for name
                            onChange={(e) => setName(e.target.value)} // Update name state
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter your email'
                            value={email} // Controlled input for email
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                            readOnly // Email is read-only as per the implementation
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter your password'
                            value={password} // Controlled input for password
                            onChange={(e) => setPassword(e.target.value)} // Update password state
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm your password'
                            value={confirmPassword} // Controlled input for confirm password
                            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                        ></Form.Control>
                    </Form.Group>
                    <Button
                        disabled={loadingUserDetails || loadingUserUpdateProfile === true} // Disable button if loading
                        type='submit'
                        className='mt-4 col-6'
                    >
                        Update
                    </Button>
                </Form>
            </Col>

            {/* Order History Section */}
            <Col md={9}>
                <h2 className='mt-4'>My Orders</h2>
                {/* Display loading, error, or orders */}
                {loadingMyOrders ? (
                    <Loader />
                ) : errorMyOrders ? (
                    <Message variant='danger' text={errorMyOrders} />
                ) : orders && orders.length === 0 ? (
                    <Message variant='info' text='No orders found!' />
                ) : (
                    <Table striped responsive className='text-center' size='sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className='align-middle'>
                                    <td>#{order._id}</td>
                                    <td>{beautifulDate(order.createdAt)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            beautifulDate(order.paidAt)
                                        ) : (
                                            <i className='fas fa-times text-danger'></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            beautifulDate(order.deliveredAt)
                                        ) : (
                                            <i className='fas fa-times text-danger'></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
