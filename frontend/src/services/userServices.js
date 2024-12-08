import { backend, authAxiosInstance } from "../utils/axiosInstance";


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
    return backend.post('/api/v1/users/register/', { 'name': name, 'email': email, 'password': password })
}


const getUserProfile = (id, { userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.get(`/api/v1/users/${id}/`)
}


const updateUserProfile = (data, { userInfo, dispatch }) => {
    const authBackend = authAxiosInstance(userInfo, dispatch)
    return authBackend.put('/api/v1/users/profile/update/', data)
}


const tokenRefresh = (data) => {
    return backend.post('/api/v1/users/token/refresh/', data)
}
const UserServices = { signInUser, signOutUser, signUpUser, getUserProfile, updateUserProfile, tokenRefresh }
export default UserServices;