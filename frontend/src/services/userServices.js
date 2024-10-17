import { backend } from "../utils/axiosInstance";


const signInUser = (email, password) => {
    return backend.post('/api/v1/users/login/')
}

const UserServices = { signInUser }
export default UserServices;