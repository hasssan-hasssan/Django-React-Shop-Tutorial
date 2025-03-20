import { backend } from "../utils/axiosInstance";

// The ProductService module provides API methods for fetching products,
// including getting all products or details of a specific product by its ID.

const getProducts = () => {
    // Sends a GET request to fetch the list of all products
    // Endpoint: '/api/v1/products/'
    return backend.get('/api/v1/products/')
}

const getProduct = (id) => {
    // Sends a GET request to fetch details of a specific product by its ID
    // Endpoint: '/api/v1/products/:id/'
    return backend.get(`/api/v1/products/${id}/`)
}

// Exported ProductService object for easier access to product-related methods
const ProductService = {
    getProduct, // Fetch a specific product's details by ID
    getProducts, // Fetch all products
}

export default ProductService // Exports the ProductService object for use in other parts of the app
