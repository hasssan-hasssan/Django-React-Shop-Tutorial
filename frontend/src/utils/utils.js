import dayjs from "dayjs"


export const calculatePrices = ({ cartItems }) => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)
    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2)
    const taxPrice = (Number((0.082) * itemsPrice)).toFixed(2)
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice))
    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    }
}


export const beautifulDate = (date) => {
    const dateFormatted = dayjs(date).format('MMMM D, YYYY, h:mm A')
    return dateFormatted
}