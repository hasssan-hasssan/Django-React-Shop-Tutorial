import React from 'react'
import { Spinner } from 'react-bootstrap'

// Import the Spinner component from React-Bootstrap
function Loader() {
    return (
        // A Spinner component used to display a loading indicator
        <Spinner
            animation='border' // Sets the animation type to 'border'
            role='status'      // ARIA role for accessibility (indicates a status update)
            style={{
                // Inline styles for the spinner
                height: '100px',   // Spinner height
                width: '100px',    // Spinner width
                display: 'block',  // Ensures the spinner is displayed as a block element
                margin: 'auto',    // Centers the spinner horizontally on the page
            }}
        >
            {/* For screen readers: Text to describe the loading status */}
            <span className='sr-only'>Loading</span>
        </Spinner>
    )
}

// Exporting the Loader component for use in other parts of the app
export default Loader
