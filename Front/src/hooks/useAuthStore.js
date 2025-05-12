import { useDispatch, useSelector } from "react-redux"
import backendApi from "../api/backendApi"
import { checking, login, logout } from "../store/auth/authSlice"
import { jwtDecode } from "jwt-decode"

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector( state => state.auth )
    const dispatch = useDispatch()

    const startLogin = async({ email, password }) => {
        dispatch( checking() )
        try {
            const { data } = await backendApi.post('/auth/login', {email, password})
            localStorage.setItem('token', data.token)
            dispatch( login({ uid: data.uid, name: data.name }) )
            return true
        } catch (error) {
            dispatch( logout(error.response.data.message) )
            return false
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch( logout() )
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token')

        if(!token){
            return dispatch( logout() )
        }

        const { exp, name, id } = jwtDecode(token)

        if( Date.now() > ( exp*1000 )){
            try {
                const { data } = await backendApi.get('/auth/check-status')
                localStorage.setItem('token', data.token)
                return dispatch( login({ uid: data.uid, name: data.name }) )
            } catch (error) {
                localStorage.clear()
                return dispatch( logout() )
            }
        }
        
        dispatch( login({ uid: id, name: name }) )
    }
    
    return {
        status,
        user,
        errorMessage,
        checkAuthToken,
        startLogin,
        startLogout
    }
}