import {Outlet} from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'

const PersistLogin = ()=> {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const {auth, persistor} = useAuth()

    useEffect(()=> {
        const verifyRefreshToken = async () => {
            try {
                    await refresh()
            } catch (error) {
                console.error(error)
            }
            finally {
                setIsLoading(false)
            }
        }
        !auth?.accssToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    useEffect(()=> {
        console.log('isLoading: ', isLoading)
        console.log(`at: , ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])
    return (
        <>
        {!persistor ? <Outlet/> : isLoading ? <p>Loading...</p> : <Outlet/>}</>
    )
}

export default PersistLogin