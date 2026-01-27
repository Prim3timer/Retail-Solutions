import axios from "../app/api/axios";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import AuthProvider from "../context/authProvider";
import { useContext } from "react";

const useRefreshToken = () => {
    // const {setAuth}  = useAuth()
    // const axiosPrivate = useAxiosPrivate()
    const { setAuth } = useContext(AuthProvider)
    const refresh = async () => {
        console.log('on refersh')
        const response = await axios.get('http://localhost:3500/refresh', {
            // this allows us to send cookies with our request
            withCredentials: true
        })
        setAuth && setAuth(prev => {
            // console.log(JSON.stringify(prev))
            // console.log(response.data.refreshToken)
            return {
                ...prev, accessToken: response.data.accessToken,
                roles: response.data.roles,
                user: response.data.username,
                picker: response.data.id,
                users: response.data.users,
                // refresh: response.data.refreshToken
            }
        })
        return response.data.accessToken
    }
    return refresh
}

export default useRefreshToken