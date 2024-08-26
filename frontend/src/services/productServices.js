import { backend } from "../utils/axiosInstance";

const getProducts = () => {
    return backend.get('/api/v1/products/')
}

const getProduct = (id) => {
    return backend.get(`/api/v1/products/${id}/`)
}


const ProductService = {
    getProduct,
    getProducts,
}

export default ProductService;