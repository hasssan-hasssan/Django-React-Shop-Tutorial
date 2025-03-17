import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'


function PrivateComponent({ component: WrappedComponent }) {
    const location = useLocation()
    const { userInfo } = useSelector(state => state.userLogin || {})
    const isAuthenticated = userInfo && userInfo.access ? true : false
    const redirect = encodeURIComponent(location.pathname + location.search)

    if (!isAuthenticated)
        return <Navigate to={`/login?redirect=${redirect}`} />

    return <WrappedComponent />
}

PrivateComponent.propTypes = {
    WrappedComponent: PropTypes.elementType.isRequired,
}


export default PrivateComponent