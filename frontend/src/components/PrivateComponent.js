import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'


// PrivateComponent ensures that only authenticated users can access certain components.
// It redirects unauthenticated users to the login page.

function PrivateComponent({ component: WrappedComponent }) {
    // useLocation retrieves the current URL, including the pathname and query string.
    const location = useLocation()

    // useSelector accesses the Redux state to retrieve user information, specifically 'userLogin'.
    const { userInfo } = useSelector(state => state.userLogin || {})

    // Determines if the user is authenticated based on the existence of 'userInfo.access'.
    const isAuthenticated = userInfo && userInfo.access ? true : false

    // Encodes the current path and query string for use in a redirect URL.
    const redirect = encodeURIComponent(location.pathname + location.search)

    // If the user is not authenticated, redirect them to the login page with the current path as a query string.
    if (!isAuthenticated)
        return <Navigate to={`/login?redirect=${redirect}`} />

    // If the user is authenticated, render the provided wrapped component.
    return <WrappedComponent />
}

// Specifies the expected type for the 'WrappedComponent' prop to ensure type safety.
PrivateComponent.propTypes = {
    WrappedComponent: PropTypes.elementType.isRequired,
}

// Exporting PrivateComponent for use in other parts of the app
export default PrivateComponent
