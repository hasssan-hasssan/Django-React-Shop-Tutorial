import React from 'react'

// The Rating component is a reusable UI element for displaying star ratings with optional text.

function Rating({ value, text, color }) {
    return (
        <div>
            {/* Rendering the first star */}
            <span>
                <i style={{ color }} className={
                    value >= 1 ? "fas fa-star"             // Full star for value >= 1
                        : value >= 0.5 ? "fas fa-star-half-alt" // Half star for value >= 0.5
                            : "far fa-star"             // Empty star for value < 0.5
                }></i>
            </span>

            {/* Rendering the second star */}
            <span>
                <i style={{ color }} className={
                    value >= 2 ? "fas fa-star"
                        : value >= 1.5 ? "fas fa-star-half-alt"
                            : "far fa-star"
                }></i>
            </span>

            {/* Rendering the third star */}
            <span>
                <i style={{ color }} className={
                    value >= 3 ? "fas fa-star"
                        : value >= 2.5 ? "fas fa-star-half-alt"
                            : "far fa-star"
                }></i>
            </span>

            {/* Rendering the fourth star */}
            <span>
                <i style={{ color }} className={
                    value >= 4 ? "fas fa-star"
                        : value >= 3.5 ? "fas fa-star-half-alt"
                            : "far fa-star"
                }></i>
            </span>

            {/* Rendering the fifth star */}
            <span>
                <i style={{ color }} className={
                    value >= 5 ? "fas fa-star"
                        : value >= 4.5 ? "fas fa-star-half-alt"
                            : "far fa-star"
                }></i>
            </span>

            {/* Display optional text next to the rating (e.g., "3 reviews") */}
            <span>{text && text}</span>
        </div>
    )
}

// Exporting the Rating component for use in other parts of the app
export default Rating
