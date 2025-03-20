import dayjs from "dayjs"


// Function to calculate prices for items, shipping, tax, and total in the cart
export const calculatePrices = ({ cartItems }) => {
    // Calculate the total price of all items in the cart
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2) // Formats to 2 decimal places

    // Determine shipping price based on the items total (free if total > $100, otherwise $10)
    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2)

    // Calculate tax as 8.2% of the items price (formatted to 2 decimal places)
    const taxPrice = (Number((0.082) * itemsPrice)).toFixed(2)

    // Calculate the total price by summing items price, shipping, and tax
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    // Return an object containing all calculated prices
    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    }
}

// Function to format a given date into a readable string
export const beautifulDate = (date) => {
    // Format the date using Day.js library in the format: "Month Day, Year, Hour:Minute AM/PM"
    const dateFormatted = dayjs(date).format('MMMM D, YYYY, h:mm A')
    return dateFormatted
}

// Function to get and encode the 'redirect' query parameter from URLSearchParams
export const getRedirectParam = (urlParams, defaultRedirect = '/') => {
    // Retrieve the 'redirect' parameter or fallback to the defaultRedirect ('/')
    // Encodes the URL parameter to ensure it is safe for use in navigation
    return encodeURIComponent(urlParams?.get('redirect') ?? defaultRedirect);
}



