import { backend } from "../utils/axiosInstance";


const signInUser = (email, password) => {
    return backend.post('/api/v1/users/login/', { 'username': email, 'password': password }).then((response) => {
        if (String(response.status).startsWith('2')) {
            // if request successfull then
            // we store in localStorage the user information 
            localStorage.setItem('userInfo', JSON.stringify(response.data))
        }
        return response
    })
}


const signOutUser = () => {
    localStorage.removeItem('userInfo')
}

const UserServices = { signInUser, signOutUser }
export default UserServices;