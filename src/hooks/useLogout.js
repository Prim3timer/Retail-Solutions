import axios from "../app/api/axios"
import useAuth from "./useAuth"
import AuthContext from "../context/authProvider"
import { useContext } from "react"

const useLogout = ()=> {
    const {setAuth} = useAuth()
    const {setIsRotated, isRotated} = useContext(AuthContext)
    
    const logout = async () => {
        setAuth({})
        setIsRotated(false)
        localStorage.removeItem('memId')
        localStorage.removeItem('memUser')
        localStorage.removeItem('memTransaction')
        console.log(isRotated)
        try {
            const response = await axios('/auth/logout', {
                withCredentials: true
            })
         
        } catch (error) {
            console.error(error)
        }
    }
    return logout
}

export default useLogout