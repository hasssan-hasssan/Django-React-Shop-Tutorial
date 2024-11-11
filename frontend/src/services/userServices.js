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


const signUpUser = (name, email, password) => {
    return backend.post('/api/v1/users/register/', { 'name': name, 'email': email, 'password': password }).then((response) => {
        if (String(response.status).startsWith('2')) {
            localStorage.setItem('userInfo', JSON.stringify(response.data))
        }
        return response
    })
}


const getUserProfile = (id, config) => {
    return backend.get(`/api/v1/users/${id}/`, config)
}


const updateUserProfile = (data, config) => {
    return backend.put('/api/v1/users/profile/update/', data, config)
}
const UserServices = { signInUser, signOutUser, signUpUser, getUserProfile, updateUserProfile }
export default UserServices;