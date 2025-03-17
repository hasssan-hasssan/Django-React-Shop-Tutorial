import React from 'react'
import OrderServices from '../services/orderServices'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { ListGroup, Button, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

function PayResultScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { token } = useParams()
    const { userInfo } = useSelector(state => state.userLogin)

    const [serverMsg, setServerMsg] = React.useState('')
    const [serverOrderId, setServerOrderId] = React.useState('')
    const [serverRefNumber, setServerRefNumber] = React.useState('')
    const [serverStatus, setServerStatus] = React.useState('')
    const [success, setSuccess] = React.useState(false)
    const [serverTrackId, setServerTrackId] = React.useState('')
    const [serverError, setServerError] = React.useState('')


    React.useEffect(() => {
        OrderServices.inquiryPay(token, { userInfo, dispatch })
            .then((response) => {
                console.log(response)
                const data = response.data
                if (data.success)
                    setSuccess(true)
                setServerMsg(data.message)
                setServerOrderId(data.orderId)
                setServerRefNumber(data.refNumber)
                setServerStatus(data.status)
                setServerTrackId(data.trackId)
            })
            .catch((error) => {
                console.log(error)
                if (error.response && error.response.data.detail) {
                    setServerError(error.response.data.detail)
                } else {
                    setServerError(error.message)
                }
            })
    }, [token, dispatch, userInfo])

    const goOrder = () =>{
        if (serverOrderId){
            navigate(`/order/${serverOrderId}`)
        }
    }


    return (
        <div className='mt-5'>
            {!serverError && !serverMsg ? <Loader />
                : serverError ? <Message variant='danger' text={serverError} />
                    : (
                        <FormContainer>
                            <ListGroup variant='flush' className='text-center'>
                                <ListGroup.Item>
                                    <h2 className={!success ? 'text-danger': 'text-success'}>
                                        {
                                            success ? "Transaction success" : "Transaction Fail"
                                        }
                                    </h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status Code</Col>
                                        <Col>{serverStatus}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Refrence Number</Col>
                                        <Col>{serverRefNumber}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Zibal Track ID</Col>
                                        <Col>{serverTrackId}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Order NO</Col>
                                        <Col>{serverOrderId}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button 
                                    className='w-75'
                                    onClick={goOrder}>
                                        Order details
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </FormContainer>
                    )
            }
        </div>
    )
}

export default PayResultScreen