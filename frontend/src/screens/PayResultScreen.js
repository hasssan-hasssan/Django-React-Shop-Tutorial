import React from 'react'
import OrderServices from '../services/orderServices'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { ListGroup, Button, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'


// The PayResultScreen component handles the display of payment results.
// It retrieves the payment status using a token and displays relevant transaction details to the user.

function PayResultScreen() {
    const dispatch = useDispatch() // Provides access to Redux dispatch
    const navigate = useNavigate() // Allows programmatic navigation

    // Extract token parameter from the URL
    const { token } = useParams()

    // Retrieve user login information from Redux
    const { userInfo } = useSelector(state => state.userLogin)

    // Local state to hold payment result details
    const [serverMsg, setServerMsg] = React.useState('') // Server-provided message
    const [serverOrderId, setServerOrderId] = React.useState('') // Order ID associated with the payment
    const [serverRefNumber, setServerRefNumber] = React.useState('') // Payment reference number
    const [serverStatus, setServerStatus] = React.useState('') // Payment status code
    const [success, setSuccess] = React.useState(false) // Success flag
    const [serverTrackId, setServerTrackId] = React.useState('') // Payment track ID from gateway
    const [serverError, setServerError] = React.useState('') // Error message if the request fails

    // Effect to fetch payment inquiry details from the server when the component mounts
    React.useEffect(() => {
        OrderServices.inquiryPay(token, { userInfo, dispatch }) // Call the payment inquiry API
            .then((response) => {
                console.log(response)
                const data = response.data
                if (data.success) setSuccess(true) // Set success flag if payment succeeded
                setServerMsg(data.message) // Set server-provided message
                setServerOrderId(data.orderId) // Set order ID
                setServerRefNumber(data.refNumber) // Set reference number
                setServerStatus(data.status) // Set payment status code
                setServerTrackId(data.trackId) // Set gateway-provided track ID
            })
            .catch((error) => {
                console.log(error)
                // Set appropriate error message from the server response or fallback message
                if (error.response && error.response.data.detail) {
                    setServerError(error.response.data.detail)
                } else {
                    setServerError(error.message)
                }
            })
    }, [token, dispatch, userInfo]) // Dependencies for this effect: token, dispatch, userInfo

    // Navigate to the order details page if an order ID exists
    const goOrder = () => {
        if (serverOrderId) {
            navigate(`/order/${serverOrderId}`)
        }
    }

    return (
        <div className='mt-5'>
            {/* Show loader while waiting for the response */}
            {!serverError && !serverMsg ? (
                <Loader />
            ) : serverError ? (
                // Show error message if there's an error
                <Message variant='danger' text={serverError} />
            ) : (
                // Show payment result details if the response is successful
                <FormContainer>
                    <ListGroup variant='flush' className='text-center'>
                        <ListGroup.Item>
                            {/* Show transaction success or failure */}
                            <h2 className={!success ? 'text-danger' : 'text-success'}>
                                {success ? "Transaction success" : "Transaction Fail"}
                            </h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {/* Display payment status code */}
                            <Row>
                                <Col>Status Code</Col>
                                <Col>{serverStatus}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {/* Display payment reference number */}
                            <Row>
                                <Col>Reference Number</Col>
                                <Col>{serverRefNumber}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {/* Display track ID from the payment gateway */}
                            <Row>
                                <Col>Zibal Track ID</Col>
                                <Col>{serverTrackId}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {/* Display order ID */}
                            <Row>
                                <Col>Order NO</Col>
                                <Col>{serverOrderId}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {/* Navigate to order details page */}
                            <Button
                                className='w-75'
                                onClick={goOrder}
                            >
                                Order details
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </FormContainer>
            )}
        </div>
    )
}

export default PayResultScreen
