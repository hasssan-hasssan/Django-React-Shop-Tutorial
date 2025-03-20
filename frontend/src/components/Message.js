import React from 'react'
import { Alert } from 'react-bootstrap'

// Importing the necessary Alert component
function Message({ variant, text }) {
    return (
        // The Alert component from React-Bootstrap is used to display a message.
        // 'variant' controls the style of the alert (e.g., 'success', 'danger', etc.).
        <Alert variant={variant}>
            {/* 'text' is the content to be displayed inside the alert. */}
            {text}
        </Alert>
    )
}

// Exporting the Message component for use in other parts of the app
export default Message
